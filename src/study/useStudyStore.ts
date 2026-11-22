import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import type { Experiment, ResultRow } from './types';

type StudyState = {
  participant: string | null;
  /** Rows not yet confirmed by the Sheet. Kept on the device so a bad connection never loses data. */
  queue: ResultRow[];
  /** Experiments each participant has finished on this device. */
  done: Record<string, Experiment[]>;
  setParticipant: (code: string | null) => void;
  enqueue: (row: ResultRow) => void;
  markSent: (ids: string[]) => void;
  /** Team "Redo" button: lets this participant take the task again (only their earliest row counts). */
  reopen: (code: string, experiment: Experiment) => void;
};

const noopStorage: StateStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const storage = typeof window === 'undefined' ? noopStorage : AsyncStorage;

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      participant: null,
      queue: [],
      done: {},
      setParticipant: (participant) => set({ participant }),
      enqueue: (row) =>
        set((s) => {
          const done = { ...s.done };
          if (row.experiment !== 'test') {
            const list = done[row.participant] ?? [];
            if (!list.includes(row.experiment)) done[row.participant] = [...list, row.experiment];
          }
          return { queue: [...s.queue, row], done };
        }),
      markSent: (ids) => set((s) => ({ queue: s.queue.filter((r) => !ids.includes(r.id)) })),
      reopen: (code, experiment) =>
        set((s) => ({ done: { ...s.done, [code]: (s.done[code] ?? []).filter((e) => e !== experiment) } })),
    }),
    { name: 'petsense-study', version: 1, storage: createJSONStorage(() => storage) },
  ),
);
