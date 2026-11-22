import type { SymptomEntry } from '@/src/symptom/types';

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
