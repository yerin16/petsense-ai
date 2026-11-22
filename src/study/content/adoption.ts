import type { IconName } from '@/src/ui/components';

import type { Version } from '../types';

// Experiment 1 retest (adoption). Wording follows experiment card 1, with the intro updated
// to the "Should I wait?" pitch from Maker Day 3. Every participant sees the same intro and
// the same four options; only the scenario differs (A = appetite, B = activity).

export const INTRO = {
  title: 'PetSense AI',
  tagline: 'For the moments you’re asking: should I wait?',
  body: [
    'PetSense AI is a pet-health app for owners of senior dogs or dogs with ongoing health conditions.',
    'You record your dog’s symptoms and health changes over time, which builds a health history.',
    'When something new happens and you’re not sure what to do, PetSense uses your dog’s own history to suggest a next step: keep an eye on it at home, call your vet, or get urgent care.',
    'It is not a replacement for veterinary care.',
  ],
};

export const SCENARIOS: Record<Version, { key: string; title: string; body: string }> = {
  A: {
    key: 'appetite',
    title: 'At breakfast',
    body: 'This morning your dog ate only about half of breakfast, which isn’t like them. Otherwise they seem like themselves: drinking water, walking normally, and no vomiting.',
  },
  B: {
    key: 'activity',
    title: 'On the evening walk',
    body: 'On this evening’s walk, your dog wanted to head home after a few minutes and has been lying around more than usual since. They’re still eating and drinking normally, with no vomiting.',
  },
};

export type AdoptionChoice = 'petsense' | 'google' | 'vet' | 'wait';

export const OPTIONS: { id: AdoptionChoice; label: string; icon: IconName }[] = [
  { id: 'petsense', label: 'Open PetSense AI', icon: 'star-four-points-outline' },
  { id: 'google', label: 'Search on Google', icon: 'magnify' },
  { id: 'vet', label: 'Contact a vet', icon: 'phone-outline' },
  { id: 'wait', label: 'Wait and monitor', icon: 'eye-outline' },
];

/** Same participant → same button order every time; different participants → different orders. */
export function optionOrder(code: string) {
  let seed = [...code].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const list = [...OPTIONS];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
