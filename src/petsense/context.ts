import { ageYears, dayISO, daysFromToday } from '@/src/seed/dates';
import type { CheckIn, Med, Metric, Pet, TimelineEvent } from '@/src/seed/types';
import { STARTED, SYMPTOMS, type SymptomEntry } from '@/src/symptom/types';

const METRIC_WORDS: Record<Metric, [string, string]> = {
  appetite: ['ate a bit less', 'ate much less'],
  energy: ['a bit low energy', 'very low energy'],
  stool: ['soft stool', 'diarrhea'],
  mobility: ['stiff', 'limping'],
  water: ['drank more', 'drank much more'],
};

const ago = (date: string) => {
  const d = -daysFromToday(date);
  return d === 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`;
};

/**
 * Plain-text summary of the dog's record for PetSense. Built on the device (all data lives there)
 * and sent with the question. Keeps only what matters: profile, baseline, conditions, meds and
 * vet plans, notable check-ins from the last 30 days, and recent timeline events.
 */
export function buildContext(s: { pet: Pet; checkIns: CheckIn[]; meds: Med[]; timeline: TimelineEvent[] }): string {
  const { pet } = s;
  const since = dayISO(-30);
  const lines: string[] = [];

  lines.push(`DOG: ${pet.name}, ${ageYears(pet.dob)}-year-old ${pet.sex === 'M' ? 'male' : 'female'} ${pet.breed}, ${pet.weightLb} lb.`);
  lines.push(`Conditions: ${pet.conditions.join('; ')}. Allergies: ${pet.allergies.join(', ') || 'none'}.`);
  lines.push(`Owner's description of normal: ${Object.entries(pet.baseline).map(([k, v]) => `${k}: ${v}`).join('; ')}.`);
  lines.push(`Regular vet: ${pet.vet.name}, ${pet.vet.clinic}.`);

  lines.push('', 'MEDS:');
  for (const m of s.meds) lines.push(`- ${m.name} (${m.purpose}), ${m.scheduleLabel}.`);
  for (const m of s.meds.filter((x) => x.protocol)) {
    const p = m.protocol!;
    lines.push('', `VET PLAN: ${p.title}`, ...p.steps.map((x) => `- ${x}`), `Call the vet if: ${p.callVetIf.join('; ')}.`);
  }

  const recent = s.checkIns.filter((c) => c.date >= since);
  const notable = recent.filter((c) => c.vomited || c.note || (Object.keys(METRIC_WORDS) as Metric[]).some((k) => c[k] > 0));
  lines.push('', `DAILY CHECK-INS, last 30 days: ${recent.length} logged; days not listed were normal.`);
  for (const c of notable) {
    const parts = (Object.keys(METRIC_WORDS) as Metric[]).filter((k) => c[k] > 0).map((k) => METRIC_WORDS[k][c[k] - 1]);
    if (c.vomited) parts.push(`vomited ${c.vomited}x`);
    lines.push(`- ${ago(c.date)}: ${parts.join(', ') || 'normal'}${c.note ? ` (note: "${c.note}")` : ''}`);
  }

  lines.push('', 'HEALTH TIMELINE (most recent first):');
  const events = [...s.timeline].filter((e) => !e.upcoming).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  for (const e of events) lines.push(`- ${ago(e.date)}: ${e.title}. ${e.detail}`);
  const upcoming = s.timeline.filter((e) => e.upcoming);
  for (const e of upcoming) lines.push(`- Upcoming in ${daysFromToday(e.date)} days: ${e.title}.`);

  return lines.join('\n');
}

/** The new symptom, in words, for the prompt. */
export function describeEntry(e: SymptomEntry): string {
  const started = STARTED.find((x) => x.key === e.started)?.label ?? e.started;
  const picked = e.symptoms.map((k) => {
    const label = SYMPTOMS.find((x) => x.key === k)?.label ?? k;
    return k === 'vomiting' && e.vomitCount ? `${label} (${e.vomitCount === 3 ? '3 or more' : e.vomitCount} times)` : label;
  });
  return [
    picked.length ? `Symptoms picked: ${picked.join(', ')}.` : null,
    e.text ? `Owner wrote: "${e.text}"` : null,
    e.note ? `Owner's note: "${e.note}"` : null,
    `Started: ${started}.`,
  ]
    .filter(Boolean)
    .join('\n');
}
