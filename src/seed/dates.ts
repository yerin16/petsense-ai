const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Local YYYY-MM-DD for `offset` days from today (negative = past). */
export function dayISO(offset = 0, from = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysFromToday(iso: string): number {
  const today = parseISO(dayISO(0));
  return Math.round((parseISO(iso).getTime() - today.getTime()) / 86_400_000);
}

export function fmtUpper(iso: string): string {
  const d = parseISO(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function fmtShort(iso: string): string {
  const d = parseISO(iso);
  const m = MONTHS[d.getMonth()];
  return `${m[0]}${m.slice(1).toLowerCase()} ${d.getDate()}`;
}

export function dayLetter(iso: string): string {
  return DAYS[parseISO(iso).getDay()];
}

export function dayNum(iso: string): number {
  return parseISO(iso).getDate();
}

export function nowTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function ageYears(dob: string): number {
  const b = parseISO(dob);
  const n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
  return a;
}

export function relDue(iso: string): string {
  const n = daysFromToday(iso);
  if (n === 0) return 'today';
  if (n === 1) return 'tomorrow';
  if (n > 1) return `in ${n} days`;
  return `${-n} days ago`;
}
