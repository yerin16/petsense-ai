import { Tabs } from 'expo-router';

import { PillTabBar } from '@/src/ui/TabBar';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <PillTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="timeline" />
      <Tabs.Screen name="petsense" />
      <Tabs.Screen name="meds" />
    </Tabs>
  );
}
