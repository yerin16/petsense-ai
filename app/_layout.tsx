import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useSyncExternalStore } from 'react';

import { usePetStore } from '@/src/store/usePetStore';

const noopSubscribe = () => () => {};

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { anchor: '(tabs)' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Data lives on the device (localStorage / AsyncStorage) and dates are relative to the viewer's "today",
  // so render only on the client after saved data has loaded. Otherwise the server-rendered HTML
  // (server clock, seed data) won't match the browser and React throws a hydration error (#418).
  const onClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const hydrated = useSyncExternalStore(
    (cb) => usePetStore.persist.onFinishHydration(cb),
    () => usePetStore.persist.hasHydrated(),
    () => false,
  );

  const ready = loaded && onClient && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="checkin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="symptom" options={{ presentation: 'modal' }} />
        <Stack.Screen name="presenter" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
