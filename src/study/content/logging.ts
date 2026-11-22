import { STARTED, SYMPTOMS, type SymptomEntry } from '@/src/symptom/types';

// Experiment 2 (logging ≤ 2 min). Everyone gets the same made-up symptom (experiment card 2:
// "vomited once, appetite declined today"). A = text-first form, B = tap-to-pick form.

export const TASK = {
  petName: 'Biscuit',
  story: 'Biscuit, your 11-year-old Golden Retriever, threw up once this morning. He has also eaten less than usual today.',
  instruction: 'Please record this symptom in the app and save it.',
};

export const LIMIT_SECONDS = 120;

/**
 * Is the saved log accurate? Required: vomiting (once), eating less, started today.
 * Version B is checked exactly. Version A is free text, so this is a keyword check:
 * the team should read the `text` in the Sheet to confirm A rows.
 */
export function checkAccuracy(e: SymptomEntry) {
  const today = e.started === 'today';
  if (e.layout === 'tap') {
    const vomit = e.symptoms.includes('vomiting') && e.vomitCount === 1;
    const appetite = e.symptoms.includes('ate_less');
    return { correct: vomit && appetite && today, checks: { vomit, appetite, today } };
  }
  const t = e.text.toLowerCase();
  const vomit = /vomit|threw up|throw(n|ing)? up|puk|sick|barf/.test(t);
  const appetite = /eat|ate |ate$|food|appetite|breakfast|meal|hungry|kibble|dinner/.test(t);
  return { correct: vomit && appetite && today, checks: { vomit, appetite, today, keyword_check: true } };
}

const yes = (b: boolean) => (b ? 'Yes' : 'No');
const tick = (b: boolean) => (b ? '✓' : '✗');

/** Plain-English summary for the Sheet's "detail" column. */
export function describeLog(e: SymptomEntry, seconds: number, errors: number) {
  const { checks } = checkAccuracy(e);
  const started = STARTED.find((s) => s.key === e.started)?.label ?? e.started;
  const what =
    e.layout === 'text'
      ? `Wrote: "${e.text}"`
      : `Picked: ${e.symptoms
          .map((k) => {
            const label = SYMPTOMS.find((s) => s.key === k)?.label ?? k;
            return k === 'vomiting' && e.vomitCount ? `${label} (${e.vomitCount === 3 ? '3+' : e.vomitCount}×)` : label;
          })
          .join(', ')}`;
  return [
    `Form: ${e.layout === 'text' ? 'text-first (A)' : 'tap-to-pick (B)'}`,
    what,
    `Started: ${started}`,
    e.note ? `Note: "${e.note}"` : null,
    `Errors: ${errors}`,
    `Under 2 min: ${yes(seconds <= LIMIT_SECONDS)}`,
    `Check: vomiting${e.layout === 'tap' ? ' (1×)' : ''} ${tick(checks.vomit)}, ate less ${tick(checks.appetite)}, today ${tick(checks.today)}${
      e.layout === 'text' ? ' (keyword guess, please read the text)' : ''
    }`,
  ]
    .filter(Boolean)
    .join(' · ');
}

export function describeGiveUp(layout: 'text' | 'tap', errors: number) {
  return `Gave up · Form: ${layout === 'text' ? 'text-first (A)' : 'tap-to-pick (B)'} · Errors: ${errors}`;
}
