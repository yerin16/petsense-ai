import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import { seedState } from '@/src/seed/biscuit';
import { dayISO, nowTime } from '@/src/seed/dates';
import type { PetSenseRecord } from '@/src/petsense/types';
import { LEVEL_LABEL } from '@/src/petsense/types';
import type { CheckIn } from '@/src/seed/types';
import { describeEntryShort } from '@/src/symptom/describe';

type Seed = ReturnType<typeof seedState>;

type Actions = {
  toggleDose: (medId: string, date?: string) => void;
  saveCheckIn: (c: CheckIn) => void;
  snooze: (reminderId: string) => void;
  resetDemo: () => void;
  addAsk: (r: PetSenseRecord) => void;
  /** Saves a PetSense question and answer to the health timeline. */
  logAsk: (id: string) => void;
};

export type PetState = Seed & Actions;

// During web server rendering there is no window/localStorage, so fall back to a no-op store.
const noopStorage: StateStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const storage = typeof window === 'undefined' ? noopStorage : AsyncStorage;

export const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      ...seedState(),

      toggleDose: (medId, date = dayISO(0)) =>
        set((s) => ({
          meds: s.meds.map((m) => {
            if (m.id !== medId) return m;
            const given = { ...m.given };
            const wasGiven = Boolean(given[date]);
            if (wasGiven) delete given[date];
            else given[date] = nowTime();
            const stockLeft = Math.max(0, m.stockLeft + (wasGiven ? 1 : -1));
            return { ...m, given, stockLeft };
          }),
        })),

      saveCheckIn: (c) =>
        set((s) => ({
          checkIns: [...s.checkIns.filter((x) => x.date !== c.date), c].sort((a, b) => a.date.localeCompare(b.date)),
        })),

      snooze: (id) => set((s) => ({ snoozed: [...s.snoozed, id] })),

      resetDemo: () => set(seedState()),

      addAsk: (r) => set((s) => ({ asks: [r, ...s.asks].slice(0, 30) })),

      logAsk: (id) =>
        set((s) => {
          const r = s.asks.find((a) => a.id === id);
          if (!r || r.logged) return {};
          return {
            asks: s.asks.map((a) => (a.id === id ? { ...a, logged: true } : a)),
            timeline: [
              {
                id: `ask-${id}`,
                date: r.date,
                title: `New symptom: ${describeEntryShort(r.entry)}`,
                detail: `Logged ${r.time}. PetSense: ${LEVEL_LABEL[r.response.result.level]} (${r.response.result.headline}).`,
                tags: ['symptom'],
              },
              ...s.timeline,
            ],
          };
        }),
    }),
    {
      name: 'pet-life-demo',
      version: 1,
      storage: createJSONStorage(() => storage),
    },
  ),
);
