import type { Experiment, Version } from './types';

// Balanced random assignment: these strings were shuffled once at random, so P01–P08 get
// exactly 4 A's and 4 B's in each experiment. Each letter is one participant, P01 first.
const TABLE: Record<Experiment, string> = {
  adoption: 'AABBBAAB',
  logging: 'ABBABABA',
  trust: 'BAAAABBB',
};

/**
 * Accepts "P3", "p03", "3" → "P03". Codes starting with T (e.g. "T1" → "T01") are for team
 * trial runs: they log normally, so filter them out in the Sheet.
 */
export function normalizeCode(raw: string | undefined | null): string | null {
  const m = (raw ?? '').trim().toUpperCase().match(/^([PT])?\s*0*(\d{1,3})$/);
  if (!m) return null;
  const n = Number(m[2]);
  if (n < 1) return null;
  return `${m[1] ?? 'P'}${String(n).padStart(2, '0')}`;
}

export function versionFor(code: string, experiment: Experiment): Version {
  const n = Number(code.slice(1));
  if (code.startsWith('P') && n >= 1 && n <= TABLE[experiment].length) return TABLE[experiment][n - 1] as Version;
  // Beyond P08 (or team codes): alternate, offset per experiment so versions aren't always paired.
  const offset = { adoption: 0, logging: 1, trust: 0 }[experiment];
  return (n + offset) % 2 === 1 ? 'A' : 'B';
}
