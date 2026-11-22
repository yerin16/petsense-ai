import { usePetStore } from '@/src/store/usePetStore';
import type { SymptomEntry } from '@/src/symptom/types';

import { buildContext } from './context';
import { demoAnswer } from './demoAnswers';
import { checkRedFlags } from './redFlags';
import type { PetSenseResponse } from './types';
import { usePresenter } from './usePresenter';

/** Asks PetSense about a new symptom. Never throws: offline, it still runs the red flags and demo answers. */
export async function askPetSense(entry: SymptomEntry): Promise<PetSenseResponse> {
  const s = usePetStore.getState();
  try {
    const res = await fetch('/api/petsense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry, context: buildContext(s), passcode: usePresenter.getState().passcode }),
    });
    if (res.ok) return (await res.json()) as PetSenseResponse;
  } catch {
    // fall through to the offline answer
  }
  const flagged = checkRedFlags(entry);
  return flagged ? { result: flagged, mode: 'red_flag' } : { result: demoAnswer(entry), mode: 'demo', note: 'offline' };
}

/** Presenter mode: is this passcode right? */
export async function verifyPasscode(passcode: string): Promise<{ ok: boolean; aiConfigured: boolean } | null> {
  try {
    const res = await fetch('/api/petsense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', passcode }),
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
