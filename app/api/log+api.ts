import type { ResultRow } from '@/src/study/types';

// Forwards experiment results to the team's Google Sheet (Apps Script web app).
// The Sheet URL stays on the server: set STUDY_SHEET_URL in .env.local for local dev,
// and as an EAS environment variable for the live link.

const EXPERIMENTS = new Set(['adoption', 'logging', 'trust', 'test']);
const VERSIONS = new Set(['A', 'B', '-']);
const MAX_ROWS = 50;

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.slice(0, max) : '');

function clean(raw: unknown): ResultRow | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = str(r.id, 64);
  const participant = str(r.participant, 16);
  if (!id || !participant || !EXPERIMENTS.has(r.experiment as string) || !VERSIONS.has(r.version as string)) return null;
  return {
    id,
    participant,
    experiment: r.experiment as ResultRow['experiment'],
    version: r.version as ResultRow['version'],
    choice: str(r.choice, 100),
    seconds: typeof r.seconds === 'number' && Number.isFinite(r.seconds) ? Math.round(r.seconds * 10) / 10 : undefined,
    correct: typeof r.correct === 'boolean' ? r.correct : undefined,
    detail: str(r.detail, 2000),
    platform: str(r.platform, 16),
    client_time: str(r.client_time, 40),
  };
}

export function GET() {
  return Response.json({ configured: Boolean(process.env.STUDY_SHEET_URL) });
}

export async function POST(request: Request) {
  const sheetUrl = process.env.STUDY_SHEET_URL;
  if (!sheetUrl) return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const input = (body as { rows?: unknown })?.rows;
  const rows = (Array.isArray(input) ? input : []).slice(0, MAX_ROWS).map(clean).filter((r) => r !== null);
  if (rows.length === 0) return Response.json({ ok: false, error: 'no_valid_rows' }, { status: 400 });

  try {
    // Apps Script answers with a redirect to the result; fetch follows it.
    const res = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
      redirect: 'follow',
    });
    const out = (await res.json().catch(() => null)) as { ok?: boolean; added?: number; error?: string } | null;
    if (!res.ok || !out?.ok) {
      return Response.json({ ok: false, error: out?.error ?? `sheet_http_${res.status}` }, { status: 502 });
    }
    return Response.json({ ok: true, added: out.added ?? 0, ids: rows.map((r) => r.id) });
  } catch {
    return Response.json({ ok: false, error: 'sheet_unreachable' }, { status: 502 });
  }
}
