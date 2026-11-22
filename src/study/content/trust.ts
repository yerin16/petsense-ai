import type { Version } from '../types';

// Experiment 3 (trust). Everyone sees the same situation and the same advice (monitor at home,
// same warning signs). Only the presentation differs: A cites Biscuit's own history, B is generic.
//
// Not reviewed by a vet. The reference answer follows public guidance: VCA Animal Hospitals,
// "Diarrhea in Dogs" (https://vcahospitals.com/know-your-pet/diarrhea-in-dogs, updated Jul 3, 2026):
// see a vet if loose stool lasts more than two days, or with blood, vomiting, weakness, fever,
// abdominal pain or loss of appetite. Here it started today and none of those signs are present.

export const SITUATION = {
  title: 'This morning',
  body: 'Biscuit is your 11-year-old Golden Retriever. He sometimes has mild stomach upsets. This morning his stool was soft. Since then he has eaten breakfast, is drinking normally, and is as playful as usual. No vomiting and no blood in the stool.',
  question: 'Biscuit has soft stool today. Should I wait?',
};

export type Guidance = {
  verdict: string;
  why: string[];
  todo: string[];
};

export const GUIDANCE: Record<Version, Guidance> = {
  // A: personalized, using Biscuit's history
  A: {
    verdict: 'Likely OK to monitor at home',
    why: [
      'This looks like Biscuit’s past mild flare-ups. His last one, in October, started the same way and settled within 4 days with his vet’s flare-up plan.',
      'Today he is eating, drinking and playful, which fits a mild flare-up more than something urgent.',
    ],
    todo: ['Follow his flare-up plan: small bland meals and his probiotic.', 'Keep fresh water out and watch his next few stools.'],
  },
  // B: generic, same advice and the same warning signs
  B: {
    verdict: 'Likely OK to monitor at home',
    why: [
      'Mild soft stool in a dog who is eating, drinking and acting normally often settles on its own within a day or two.',
      'Eating and normal energy fit a mild stomach upset more than something urgent.',
    ],
    todo: ['Offer small bland meals.', 'Keep fresh water out and watch the next few stools.'],
  },
};

/** Shown in both versions, word for word (the card: never withhold red-flag warnings). */
export const SAFETY = {
  uncertainty: 'PetSense can’t examine your dog, so this could be wrong. It is not a vet.',
  callVet: ['It lasts more than 2 days', 'You see blood in the stool', 'He vomits or stops eating', 'He seems weak or in pain'],
  urgent: ['He vomits again and again', 'He collapses or can’t stand', 'His belly looks swollen or hard'],
};

export type TrustChoice = 'monitor' | 'call_vet' | 'urgent';

export const CHOICES: { id: TrustChoice; label: string }[] = [
  { id: 'monitor', label: 'Monitor at home' },
  { id: 'call_vet', label: 'Call the vet today' },
  { id: 'urgent', label: 'Go to urgent care now' },
];

/** The safe answer that matches the guidance. */
export const REFERENCE: TrustChoice = 'monitor';

export function describeTrust(version: Version, choice: TrustChoice) {
  const label = CHOICES.find((c) => c.id === choice)!.label;
  const match = choice === REFERENCE ? 'matches the safe answer' : 'more cautious than the guidance';
  return `Guidance: ${version === 'A' ? 'personalized (Biscuit’s history)' : 'generic'} · Picked: ${label} (${match})`;
}
