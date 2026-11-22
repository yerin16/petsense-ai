import Anthropic from '@anthropic-ai/sdk';

import { describeEntry } from '@/src/petsense/context';
import { demoAnswer } from '@/src/petsense/demoAnswers';
import { SYSTEM_PROMPT, TRIAGE_SCHEMA } from '@/src/petsense/prompt';
import { checkRedFlags } from '@/src/petsense/redFlags';
import type { PetSenseResponse, TriageResult } from '@/src/petsense/types';
import type { SymptomEntry } from '@/src/symptom/types';

// PetSense AI. Order of checks:
// 1. Hard-coded red-flag rules → "Go to emergency now", no AI call.
// 2. No valid presenter passcode (or no API key) → prewritten demo answer, $0.
// 3. Otherwise → Claude, using the dog's record. If that fails, fall back to the demo answer.
//
// Server-only env vars (EAS "sensitive" variables, or .env.local for local dev):
//   ANTHROPIC_API_KEY, PETSENSE_PASSCODE, optional PETSENSE_MODEL (default claude-opus-5-5).

const LEVELS = new Set(['monitor', 'call_vet', 'emergency']);
const MAX_CONTEXT = 12000;

function passcodeOk(given: unknown): boolean {
  const expected = process.env.PETSENSE_PASSCODE;
  if (!expected || typeof given !== 'string' || given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

function cleanEntry(raw: unknown): SymptomEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
  const started = r.started === 'today' || r.started === 'yesterday' || r.started === 'earlier' ? r.started : null;
  if (!started) return null;
  return {
    layout: r.layout === 'text' ? 'text' : 'tap',
    text: str(r.text, 1000),
    note: str(r.note, 1000),
    symptoms: Array.isArray(r.symptoms) ? (r.symptoms.filter((x) => typeof x === 'string').slice(0, 10) as SymptomEntry['symptoms']) : [],
    vomitCount: typeof r.vomitCount === 'number' ? r.vomitCount : null,
    started,
  };
}

const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 4) : []);

function cleanResult(raw: unknown): TriageResult | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (!LEVELS.has(r.level as string) || typeof r.headline !== 'string') return null;
  return {
    level: r.level as TriageResult['level'],
    headline: r.headline,
    why: list(r.why),
    history: list(r.history),
    todo: list(r.todo),
    call_vet_if: list(r.call_vet_if),
    emergency_if: list(r.emergency_if),
    questions_for_vet: list(r.questions_for_vet),
  };
}

async function askClaude(entry: SymptomEntry, context: string): Promise<TriageResult> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY
  const response = await client.beta.messages.create({
    model: process.env.PETSENSE_MODEL || 'claude-opus-5-5',
    max_tokens: 4000,
    // If the model declines, the API retries on Anthropic's recommended fallback model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: TRIAGE_SCHEMA } },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `<dog_record>\n${context}\n</dog_record>\n\n<new_symptom>\n${describeEntry(entry)}\n</new_symptom>\n\nShould the owner wait?`,
      },
    ],
  });
  if (response.stop_reason === 'refusal') throw new Error('refusal');
  if (response.stop_reason === 'max_tokens') throw new Error('max_tokens');
  const text = response.content.find((b) => b.type === 'text');
  const result = cleanResult(text && text.type === 'text' ? JSON.parse(text.text) : null);
  if (!result) throw new Error('bad_output');
  return result;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'bad_json' }, { status: 400 });
  }

  // Presenter mode: check a passcode without asking anything.
  if (body.action === 'verify') {
    return Response.json({ ok: passcodeOk(body.passcode), aiConfigured: Boolean(process.env.ANTHROPIC_API_KEY) });
  }

  const entry = cleanEntry(body.entry);
  if (!entry) return Response.json({ error: 'bad_entry' }, { status: 400 });
  const context = typeof body.context === 'string' ? body.context.slice(0, MAX_CONTEXT) : '';

  const flagged = checkRedFlags(entry);
  if (flagged) return Response.json({ result: flagged, mode: 'red_flag' } satisfies PetSenseResponse);

  if (!passcodeOk(body.passcode)) {
    const note = body.passcode ? 'wrong_passcode' : undefined;
    return Response.json({ result: demoAnswer(entry), mode: 'demo', note } satisfies PetSenseResponse);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ result: demoAnswer(entry), mode: 'demo', note: 'ai_not_configured' } satisfies PetSenseResponse);
  }

  try {
    const result = await askClaude(entry, context);
    return Response.json({ result, mode: 'ai' } satisfies PetSenseResponse);
  } catch (err) {
    const reason =
      err instanceof Anthropic.APIError ? `api_${err.status ?? 'error'}` : err instanceof Error ? err.message : 'unknown';
    console.error('PetSense AI failed:', reason);
    return Response.json({ result: demoAnswer(entry), mode: 'demo', note: `ai_failed:${reason}` } satisfies PetSenseResponse);
  }
}
