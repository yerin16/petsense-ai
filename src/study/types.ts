export type Experiment = 'adoption' | 'logging' | 'trust';
export type Version = 'A' | 'B';

/** One experiment result. Matches the columns in scripts/sheet-apps-script.gs. */
export type ResultRow = {
  id: string;
  participant: string;
  experiment: Experiment | 'test';
  version: Version | '-';
  choice: string;
  seconds?: number;
  correct?: boolean;
  /** Short free text, e.g. JSON of extra fields. */
  detail?: string;
  platform: string;
  client_time: string;
};
