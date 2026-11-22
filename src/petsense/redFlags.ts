import type { SymptomEntry } from '@/src/symptom/types';

import type { TriageResult } from './types';

// Hard-coded emergency rules. They run BEFORE any AI call and skip it entirely, so the most
// dangerous situations always get "Go to emergency now", even with no network or no API key.
// Not clinically validated: this is a prototype safety net, not a safety claim.

type Rule = { id: string; label: string; test: RegExp };

const RULES: Rule[] = [
  {
    id: 'bloat',
    label: 'Swollen or hard belly, or retching without bringing anything up (possible bloat)',
    test: /(swollen|bloated|distended|hard|tight)\s+(belly|stomach|abdomen|tummy)|retch|dry[- ]?heav|trying to (vomit|throw up)|unproductive vomit/,
  },
  {
    id: 'collapse',
    label: 'Collapse, seizure, or can’t stand or wake up normally',
    test: /collaps|seizure|convuls|can'?t (stand|get up|walk at all)|cannot (stand|get up)|unresponsive|passed out|faint/,
  },
  {
    id: 'breathing',
    label: 'Trouble breathing, or pale, white, blue or gray gums',
    test: /(trouble|difficulty|hard time|struggling) breathing|can'?t breathe|gasping|choking|(pale|white|blue|gr[ae]y) gums/,
  },
  {
    id: 'toxin',
    label: 'Ate something poisonous (chocolate, grapes or raisins, xylitol, rat poison, antifreeze, human medicine)',
    test: /(ate|eaten|swallowed|got into|ingested|licked)\b.{0,40}\b(chocolate|grape|raisin|xylitol|sugar[- ]free gum|rat poison|rodenticide|antifreeze|ibuprofen|advil|tylenol|acetaminophen|naproxen|pills|medication|onion|lily|lilies)/,
  },
  {
    id: 'blood',
    label: 'Vomiting blood, or black, tarry stool',
    test: /vomit(ing|ed|s)? (up )?blood|blood(y)? (in )?vomit|black,? tarry|tarry stool|coffee[- ]grounds?/,
  },
  {
    id: 'urine',
    label: 'Straining but unable to pee',
    test: /(can'?t|cannot|unable to|not able to) (pee|urinate)|straining to (pee|urinate)|no (pee|urine) (in|for) (a day|24)/,
  },
];

export function checkRedFlags(entry: SymptomEntry): TriageResult | null {
  const text = `${entry.text} ${entry.note}`.toLowerCase();
  const hits = RULES.filter((r) => r.test.test(text));
  if (hits.length === 0) return null;
  return {
    level: 'emergency',
    headline: 'Go to emergency care now',
    why: [
      `You described: ${hits.map((h) => h.label.toLowerCase()).join('; ')}.`,
      'This can be life-threatening and needs a vet to examine him right away. Don’t wait to see if it passes.',
    ],
    history: [],
    todo: [
      'Call the 24h emergency clinic now and tell them you are on your way.',
      'Bring any packaging or pills if he ate something.',
      'Don’t try to make him vomit unless a vet tells you to.',
    ],
    call_vet_if: [],
    emergency_if: ['This is already an emergency. Go now.'],
    questions_for_vet: [],
  };
}
