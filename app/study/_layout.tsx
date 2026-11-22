import { Stack } from 'expo-router';
import { useSyncExternalStore } from 'react';

import { useStudyStore } from '@/src/study/useStudyStore';

// Wait for saved study data (participant code, unsent rows) to load, so new results never
// get overwritten by the stored copy arriving late.
export default function StudyLayout() {
  const hydrated = useSyncExternalStore(
    (cb) => useStudyStore.persist.onFinishHydration(cb),
    () => useStudyStore.persist.hasHydrated(),
    () => false,
  );
  if (!hydrated) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}
