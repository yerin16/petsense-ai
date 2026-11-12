/** 0 = Biscuit's normal, 1 = mild change, 2 = big change. */
export type Level = 0 | 1 | 2;

export type Metric = 'appetite' | 'energy' | 'stool' | 'mobility' | 'water';

export type CheckIn = {
  date: string; // YYYY-MM-DD
  appetite: Level;
  energy: Level;
  stool: Level;
  mobility: Level;
  water: Level;
  vomited: number; // times in the day
  note?: string;
};

export type Pet = {
  name: string;
  breed: string;
  sex: 'M' | 'F';
  dob: string;
  weightLb: number;
  conditions: string[];
  allergies: string[];
  baseline: Record<Metric, string>; // owner's description of "normal"
  vet: { name: string; clinic: string; phone: string };
  emergencyClinic: { name: string; phone: string };
};

export type Med = {
  id: string;
  name: string;
  dose: string;
  purpose: string;
  schedule: 'daily' | 'monthly' | 'as-needed';
  scheduleLabel: string;
  stockLeft: number;
  stockTotal: number;
  /** date (YYYY-MM-DD) -> time given, e.g. "8:02 AM" */
  given: Record<string, string>;
  protocol?: { title: string; steps: string[]; callVetIf: string[] };
};

export type EventKind = 'visit' | 'vaccine' | 'med' | 'flare' | 'lab' | 'weight';

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
  tags: EventKind[];
  upcoming?: boolean;
};

export type Reminder = { id: string; title: string; dueDate: string; place: string };
