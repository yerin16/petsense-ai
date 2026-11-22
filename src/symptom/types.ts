import type { IconName } from '@/src/ui/components';

export type SymptomKey =
  | 'vomiting'
  | 'ate_less'
  | 'soft_stool'
  | 'low_energy'
  | 'limping'
  | 'drinking_more'
  | 'coughing'
  | 'other';

export const SYMPTOMS: { key: SymptomKey; label: string; icon: IconName }[] = [
  { key: 'vomiting', label: 'Vomiting', icon: 'emoticon-sick-outline' },
  { key: 'ate_less', label: 'Ate less', icon: 'food-drumstick-off-outline' },
  { key: 'soft_stool', label: 'Soft stool / diarrhea', icon: 'water-outline' },
  { key: 'low_energy', label: 'Low energy', icon: 'sleep' },
  { key: 'limping', label: 'Limping / stiff', icon: 'paw' },
  { key: 'drinking_more', label: 'Drinking more', icon: 'cup-water' },
  { key: 'coughing', label: 'Coughing', icon: 'weather-windy' },
  { key: 'other', label: 'Something else', icon: 'dots-horizontal' },
];

export type Started = 'today' | 'yesterday' | 'earlier';

export const STARTED: { key: Started; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'earlier', label: '2+ days ago' },
];

/** One new-symptom log. A = text-first (`text`), B = tap-to-pick (`symptoms` + `vomitCount`). */
export type SymptomEntry = {
  layout: 'text' | 'tap';
  text: string;
  symptoms: SymptomKey[];
  vomitCount: number | null;
  started: Started;
  note: string;
};
