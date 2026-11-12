// Demo persona for the senior / chronic-condition wedge:
// Biscuit, an 11-year-old Golden Retriever with hip osteoarthritis and a sensitive stomach (recurring GI flare-ups).
// All dates are relative to "today" so the demo always looks current.

import { dayISO } from './dates';
import type { CheckIn, Level, Med, Pet, Reminder, TimelineEvent } from './types';

export const pet: Pet = {
  name: 'Biscuit',
  breed: 'Golden Retriever',
  sex: 'M',
  dob: dayISO(-(11 * 365 + 40)),
  weightLb: 68,
  conditions: ['Hip osteoarthritis', 'Sensitive stomach (recurring GI flare-ups)'],
  allergies: ['Pollen'],
  baseline: {
    appetite: 'Finishes both meals (2 cups senior kibble, 7 AM + 6 PM)',
    energy: 'Two 20-min walks, naps most of the afternoon',
    stool: 'Firm, 2× a day',
    mobility: 'A little stiff getting up in the morning, fine after 5 min',
    water: 'About 6 cups a day',
  },
  vet: { name: 'Dr. Anna Patel', clinic: 'Sunny Paws Veterinary', phone: '(212) 555-0148' },
  emergencyClinic: { name: 'BluePearl 24h Emergency', phone: '(212) 555-0199' },
};

/** Deterministic pseudo-random so the seeded history is the same on every reset. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildCheckIns(): CheckIn[] {
  const r = rng(11);
  const out: CheckIn[] = [];
  // 60 days of history, ending yesterday (today is left for the owner to log).
  for (let off = -60; off <= -1; off++) {
    const lvl = (p1: number, p2 = 0): Level => {
      const x = r();
      return x < p2 ? 2 : x < p1 ? 1 : 0;
    };
    const c: CheckIn = {
      date: dayISO(off),
      appetite: lvl(0.06),
      energy: lvl(0.1),
      stool: lvl(0.05),
      mobility: lvl(0.3, 0.02), // OA: stiff mornings are common
      water: 0,
      vomited: 0,
    };
    // Past GI flare-up, 37–34 days ago: soft stool → diarrhea, low appetite, one vomit.
    if (off >= -37 && off <= -34) {
      c.stool = off === -36 ? 2 : 1;
      c.appetite = off === -36 ? 2 : 1;
      c.energy = 1;
      c.vomited = off === -36 ? 1 : 0;
      if (off === -37) c.note = 'Ate something on the walk?';
      if (off === -36) c.note = 'Started bland diet + Proviable per flare-up plan';
    }
    // Rainy cold week 12–9 days ago: stiffer hips.
    if (off >= -12 && off <= -9) c.mobility = off === -10 ? 2 : 1;
    if (off === -10) c.note = 'Limping on back left after the long walk';
    // The last two days: soft stool again and a little less appetite. This sets up the PetSense demo.
    if (off === -2) Object.assign(c, { stool: 1, appetite: 0, note: 'Stool a bit soft' });
    if (off === -1) Object.assign(c, { stool: 1, appetite: 1, energy: 1, note: 'Left a little breakfast' });
    out.push(c);
  }
  return out;
}

function dailyGiven(missDays: number[], time: string, includeToday: boolean): Record<string, string> {
  const g: Record<string, string> = {};
  for (let off = -60; off <= (includeToday ? 0 : -1); off++) {
    if (!missDays.includes(off)) g[dayISO(off)] = time;
  }
  return g;
}

function monthlyGiven(): Record<string, string> {
  const g: Record<string, string> = {};
  const now = new Date();
  for (let k = 1; k <= 3; k++) {
    const d = new Date(now.getFullYear(), now.getMonth() - k, 15);
    g[dayISO(0, d)] = '9:00 AM';
  }
  if (now.getDate() > 15) g[dayISO(0, new Date(now.getFullYear(), now.getMonth(), 15))] = '9:00 AM';
  return g;
}

export const meds: Med[] = [
  {
    id: 'galliprant',
    name: 'Galliprant 60 mg',
    dose: '1 tablet',
    purpose: 'for hip arthritis pain',
    schedule: 'daily',
    scheduleLabel: 'Daily at 8:00 AM · with food',
    stockLeft: 6,
    stockTotal: 30,
    given: dailyGiven([-19, -44], '8:02 AM', true),
  },
  {
    id: 'omega3',
    name: 'Omega-3 fish oil',
    dose: '1 pump',
    purpose: 'joint support',
    schedule: 'daily',
    scheduleLabel: 'Daily at 6:00 PM · on dinner',
    stockLeft: 22,
    stockTotal: 60,
    given: dailyGiven([-3, -27, -28], '6:10 PM', false),
  },
  {
    id: 'heartgard',
    name: 'Heartgard Plus',
    dose: '1 chew',
    purpose: 'heartworm prevention',
    schedule: 'monthly',
    scheduleLabel: 'Monthly on the 15th',
    stockLeft: 2,
    stockTotal: 6,
    given: monthlyGiven(),
  },
  {
    id: 'proviable',
    name: 'Proviable-DC',
    dose: '1 capsule',
    purpose: 'probiotic, only during GI flare-ups',
    schedule: 'as-needed',
    scheduleLabel: 'As needed · per flare-up plan',
    stockLeft: 9,
    stockTotal: 10,
    given: { [dayISO(-36)]: '8:00 AM' },
    protocol: {
      title: 'GI flare-up plan · from Dr. Patel',
      steps: [
        'Skip the next meal, keep water available',
        'Bland diet for 48 h: boiled lean turkey + white rice (1:2)',
        'Proviable-DC 1 capsule daily for 5 days',
        'Log stool and appetite every day',
      ],
      callVetIf: [
        'Vomits more than twice in 24 h',
        'Blood in stool or black, tarry stool',
        'Won’t eat for more than 24 h, or seems weak',
      ],
    },
  },
];

export const timeline: TimelineEvent[] = [
  {
    id: 'up-bloodwork',
    date: dayISO(6),
    title: 'Senior wellness exam + bloodwork',
    detail: 'Sunny Paws Veterinary · not booked yet',
    tags: ['visit', 'lab'],
    upcoming: true,
  },
  {
    id: 'flare-2',
    date: dayISO(-37),
    title: 'GI flare-up (home care)',
    detail: 'Soft stool 3 days, vomited once. Bland diet + Proviable per plan, resolved in 4 days.',
    tags: ['flare'],
  },
  {
    id: 'senior-check',
    date: dayISO(-96),
    title: 'Senior checkup',
    detail: 'Dr. Anna Patel · kidney values normal (SDMA 12), weight 68 lb, hip stiffness noted',
    tags: ['visit', 'lab', 'weight'],
  },
  {
    id: 'galliprant-start',
    date: dayISO(-96),
    title: 'Started Galliprant 60 mg',
    detail: 'For hip osteoarthritis pain · 1 tablet daily with food',
    tags: ['med'],
  },
  {
    id: 'flare-1',
    date: dayISO(-152),
    title: 'GI flare-up visit',
    detail: 'Dr. Anna Patel · vomiting + diarrhea 2 days. Fecal test negative. Flare-up plan created.',
    tags: ['visit', 'flare'],
  },
  {
    id: 'xray',
    date: dayISO(-210),
    title: 'Hip X-rays',
    detail: 'Mild osteoarthritis in both hips. Start joint supplement, keep weight under 70 lb.',
    tags: ['visit', 'lab'],
  },
  {
    id: 'vaccines',
    date: dayISO(-300),
    title: 'Rabies (3-yr) + DHPP boosters',
    detail: 'Sunny Paws Veterinary · certificate on file',
    tags: ['vaccine'],
  },
];

export const reminders: Reminder[] = [
  { id: 'up-bloodwork', title: 'Senior bloodwork due', dueDate: dayISO(6), place: 'Sunny Paws Veterinary' },
];

export function seedState() {
  return {
    pet,
    checkIns: buildCheckIns(),
    meds: JSON.parse(JSON.stringify(meds)) as Med[],
    timeline: timeline.map((e) => ({ ...e })),
    reminders: reminders.map((r) => ({ ...r })),
    snoozed: [] as string[],
  };
}
