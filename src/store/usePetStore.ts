import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import { seedState } from '@/src/seed/biscuit';
import { dayISO, nowTime } from '@/src/seed/dates';
import type { CheckIn } from '@/src/seed/types';

type Seed = ReturnType<typeof seedState>;

type Actions = {
  toggleDose: (medId: string, date?: string) => void;
  saveCheckIn: (c: CheckIn) => void;
  snooze: (reminderId: string) => void;
  resetDemo: () => void;
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
    }),
    {
      name: 'pet-life-demo',
      version: 1,
      storage: createJSONStorage(() => storage),
    },
  ),
);
