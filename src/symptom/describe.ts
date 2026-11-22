import { SYMPTOMS, type SymptomEntry } from './types';

/** Short label for a symptom log, e.g. "Vomiting (1×), Ate less" or the first words of the text. */
export function describeEntryShort(e: SymptomEntry): string {
  if (e.symptoms.length) {
    return e.symptoms
      .map((k) => {
        const label = SYMPTOMS.find((s) => s.key === k)?.label ?? k;
        return k === 'vomiting' && e.vomitCount ? `${label} (${e.vomitCount === 3 ? '3+' : e.vomitCount}×)` : label;
      })
      .join(', ');
  }
  const t = e.text.trim();
  return t.length > 60 ? `${t.slice(0, 57)}…` : t || 'Something new';
}
