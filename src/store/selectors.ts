import { dayISO, parseISO } from '@/src/seed/dates';
import type { CheckIn, Level, Med, Metric } from '@/src/seed/types';

export const METRICS: { key: Metric; label: string; words: [string, string, string] }[] = [
  { key: 'appetite', label: 'Appetite', words: ['Normal', 'Ate less', 'Skipped a meal'] },
  { key: 'energy', label: 'Energy', words: ['Normal', 'Quieter', 'Very low'] },
  { key: 'stool', label: 'Stool', words: ['Firm', 'Soft', 'Diarrhea'] },
  { key: 'mobility', label: 'Mobility', words: ['Normal', 'Stiff', 'Limping'] },
  { key: 'water', label: 'Water', words: ['Normal', 'More/less', 'Much more/less'] },
];

/** Is this med expected today? */
export function dueToday(m: Med, today = dayISO(0)): boolean {
  if (m.schedule === 'daily') return true;
  if (m.schedule === 'monthly') return parseISO(today).getDate() === 15;
  return false;
}

export type MetricSummary = { key: Metric; label: string; level: Level; text: string; usual: boolean };

/**
 * Compare the last 3 logged days against Biscuit's own 60-day pattern.
 * A change counts as "usual" if it happens on at least 25% of days (e.g. stiff mornings with arthritis).
 */
export function recentVsNormal(checkIns: CheckIn[]): MetricSummary[] {
  const recent = checkIns.slice(-3);
  const history = checkIns.slice(0, -3);
  return METRICS.map(({ key, label, words }) => {
    const level = Math.max(0, ...recent.map((c) => c[key])) as Level;
    const daysOff = recent.filter((c) => c[key] > 0).length;
    const rate = history.length ? history.filter((c) => c[key] > 0).length / history.length : 0;
    const usual = level > 0 && rate >= 0.25 && level === 1;
    let text = words[0];
    if (level > 0) {
      text = `${words[level]} · ${daysOff} of last 3 days`;
      if (usual) text = `${words[level]} · usual for him`;
    }
    return { key, label, level, text, usual };
  });
}

export function streak(checkIns: CheckIn[]): number {
  const dates = new Set(checkIns.map((c) => c.date));
  let n = 0;
  let off = dates.has(dayISO(0)) ? 0 : -1;
  while (dates.has(dayISO(off))) {
    n++;
    off--;
  }
  return n;
}

/** Was every expected daily dose given on that date? */
export function adherence(meds: Med[], date: string): 'all' | 'missed' | 'none' {
  const daily = meds.filter((m) => m.schedule === 'daily');
  if (!daily.length) return 'none';
  return daily.every((m) => m.given[date]) ? 'all' : 'missed';
}
