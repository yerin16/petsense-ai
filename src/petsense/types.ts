import type { SymptomEntry } from '@/src/symptom/types';

export type TriageLevel = 'monitor' | 'call_vet' | 'emergency';

/** PetSense's answer, shown as the triage card. Same shape for AI, demo and red-flag answers. */
export type TriageResult = {
  level: TriageLevel;
  /** One short line, e.g. "Likely OK to watch at home today". */
  headline: string;
  /** Why this level, citing the dog's own history where it helps. */
  why: string[];
  /** Facts from the dog's record that PetSense used. */
  history: string[];
  /** What the owner can do now. */
  todo: string[];
  /** Stop waiting and call the vet if any of these happen. */
  call_vet_if: string[];
  /** Go to emergency care now if any of these happen. */
  emergency_if: string[];
  /** Questions worth asking the vet. */
  questions_for_vet: string[];
};

/** Where the answer came from: red-flag rules, Claude, or prewritten demo answers. */
export type AnswerMode = 'red_flag' | 'ai' | 'demo';

export type PetSenseRequest = {
  entry: SymptomEntry;
  /** Plain-text summary of the dog's record, built on the device. */
  context: string;
  passcode?: string | null;
};

export type PetSenseResponse = {
  result: TriageResult;
  mode: AnswerMode;
  /** Why a demo answer was used instead of AI, when relevant. */
  note?: string;
};

export const LEVEL_LABEL: Record<TriageLevel, string> = {
  monitor: 'Monitor at home',
  call_vet: 'Call your vet today',
  emergency: 'Go to emergency now',
};

/** One "Should I wait?" question and PetSense's answer, kept on the device. */
export type PetSenseRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  entry: SymptomEntry;
  response: PetSenseResponse;
  /** Saved to the health timeline. */
  logged: boolean;
};
