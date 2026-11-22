import type { SymptomEntry } from '@/src/symptom/types';

import type { TriageResult } from './types';

// Prewritten answers for demo mode (the public link without the presenter passcode, or when the
// AI call fails). Written for the demo persona, Biscuit, and his seeded history. Picked by
// simple keyword and symptom matching. Follows the same rules as the AI: no diagnosis, no doses,
// one level more cautious when unsure.

const has = (e: SymptomEntry, keys: string[], words: RegExp) =>
  keys.some((k) => e.symptoms.includes(k as never)) || words.test(`${e.text} ${e.note}`.toLowerCase());

const GI_CALL_IF = [
  'It lasts more than 2 days',
  'He vomits more than twice in 24 hours',
  'You see blood in his stool, or it turns black and tarry',
  'He won’t eat for more than 24 hours, or seems weak',
];

const EMERGENCY_IF = [
  'His belly looks swollen or he retches without bringing anything up',
  'He collapses, can’t stand, or his gums look pale',
];

export function demoAnswer(e: SymptomEntry): TriageResult {
  const vomit = has(e, ['vomiting'], /vomit|threw up|throw up|puk|sick/);
  const gi = vomit || has(e, ['soft_stool', 'ate_less'], /stool|poop|diarrh|loose|ate less|appetite|not eating|skipped|left (some|half)/);
  const limp = has(e, ['limping'], /limp|stiff|lame|hip|leg/);
  const thirst = has(e, ['drinking_more'], /drink(ing)? (a lot|more)|thirst|water bowl/);
  const cough = has(e, ['coughing'], /cough|honk|hack/);
  const older = e.started === 'earlier';
  const manyVomits = (e.vomitCount ?? 0) >= 3 || /twice|two times|three|3 times|several|again and again/.test(`${e.text} ${e.note}`.toLowerCase());

  if (gi) {
    if (older || manyVomits) {
      return {
        level: 'call_vet',
        headline: 'Call Dr. Patel today',
        why: [
          older
            ? 'This has gone on for 2+ days, which is longer than his flare-up plan covers at home.'
            : 'More than two vomits in a day is past what his flare-up plan says to handle at home.',
          'He is 11, so it’s worth having the vet decide on next steps rather than waiting longer.',
        ],
        history: [
          'His soft stool started 2 days ago in his check-ins, and he left some breakfast yesterday.',
          'His last flare-up (about 5 weeks ago) settled in 4 days with the flare-up plan.',
        ],
        todo: ['Call Sunny Paws today and describe the timeline.', 'Keep water out and stick to small bland meals until you talk to them.'],
        call_vet_if: [],
        emergency_if: EMERGENCY_IF,
        questions_for_vet: ['Should we run a fecal test again?', 'Should his senior bloodwork happen sooner than next week?'],
      };
    }
    return {
      level: 'monitor',
      headline: 'Likely OK to watch at home today',
      why: [
        'This looks like his usual mild GI flare-ups: he has a sensitive stomach, and his last flare-up started the same way.',
        'One vomit or soft stool, while he is still drinking and acting like himself, fits his flare-up plan rather than an emergency.',
      ],
      history: [
        'Dr. Patel’s flare-up plan: skip a meal, bland diet for 48 hours, probiotic, log stool daily.',
        'His last flare-up (about 5 weeks ago) resolved in 4 days with that plan.',
        'His check-ins show soft stool on the last 2 days.',
      ],
      todo: ['Start his flare-up plan from the Meds tab.', 'Log his stool and appetite tonight and tomorrow morning.'],
      call_vet_if: GI_CALL_IF,
      emergency_if: EMERGENCY_IF,
      questions_for_vet: ['Is this happening more often than it should?'],
    };
  }

  if (limp) {
    return {
      level: 'monitor',
      headline: 'Likely OK to rest and watch today',
      why: [
        'He has hip arthritis, and his check-ins show stiff spells before, like the cold week 10 days ago, that settled with rest.',
        'If he still puts weight on the leg and is eating normally, rest and a short walk are reasonable for today.',
      ],
      history: ['Hip X-rays: mild arthritis in both hips.', 'Takes Galliprant daily for hip pain.', 'Limped after a long walk 10 days ago, then recovered.'],
      todo: ['Keep walks short and on flat ground today.', 'Make sure today’s Galliprant dose was given.'],
      call_vet_if: ['He won’t put any weight on the leg', 'It isn’t better after 24 to 48 hours of rest', 'The leg is swollen, hot, or he cries when touched'],
      emergency_if: ['He can’t stand or get up at all', 'The leg hangs at an odd angle after a fall'],
      questions_for_vet: ['Is his arthritis getting worse?', 'Would physical therapy or a dose review help?'],
    };
  }

  if (thirst) {
    return {
      level: 'call_vet',
      headline: 'Call your vet today (not urgent)',
      why: [
        'Drinking much more than his usual 6 cups a day can be an early sign of kidney or hormone changes in senior dogs.',
        'It isn’t usually an emergency, but it’s worth checking soon. His senior bloodwork is due next week anyway.',
      ],
      history: ['Normal water: about 6 cups a day.', 'Kidney values were normal at his last checkup (SDMA 12).', 'Senior bloodwork due in 6 days.'],
      todo: ['Measure how much water he drinks in 24 hours.', 'Ask whether to move his bloodwork up.'],
      call_vet_if: [],
      emergency_if: ['He vomits repeatedly or stops eating', 'He strains to pee without much coming out'],
      questions_for_vet: ['Should we check urine and kidney values sooner?'],
    };
  }

  // Coughing, low energy alone, "something else", or anything we can't match: be cautious.
  return {
    level: 'call_vet',
    headline: 'Call your vet today to be safe',
    why: [
      cough
        ? 'A new cough in an 11-year-old dog is worth a vet’s opinion, even if he otherwise seems fine.'
        : 'This doesn’t match his usual patterns, so PetSense can’t compare it with his history.',
      'When it isn’t clear, PetSense picks the more cautious option.',
    ],
    history: ['He is 11 and has hip arthritis and a sensitive stomach.'],
    todo: ['Call Sunny Paws and describe what you’re seeing and when it started.', 'Log it so you can show the vet the timeline.'],
    call_vet_if: [],
    emergency_if: ['He has trouble breathing or his gums look pale or blue', 'He collapses or can’t stand'],
    questions_for_vet: [],
  };
}
