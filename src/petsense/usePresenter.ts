import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

// Presenter mode: the team passcode, remembered on this device. The server checks it before
// calling Claude; without it everyone gets demo answers. Never put the passcode in app code.

type PresenterState = {
  passcode: string | null;
  setPasscode: (p: string | null) => void;
};

const noopStorage: StateStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const storage = typeof window === 'undefined' ? noopStorage : AsyncStorage;

export const usePresenter = create<PresenterState>()(
  persist((set) => ({ passcode: null, setPasscode: (passcode) => set({ passcode }) }), {
    name: 'petsense-presenter',
    version: 1,
    storage: createJSONStorage(() => storage),
  }),
);
