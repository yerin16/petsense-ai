import type { BottomTabBarProps } from 'expo-router/tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName } from './components';
import { colors, fonts, gradients, shadow } from './theme';

export const TAB_META: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Home', icon: 'home-outline' },
  timeline: { label: 'Timeline', icon: 'clock-outline' },
  petsense: { label: 'PetSense', icon: 'star-four-points-outline' },
  meds: { label: 'Meds', icon: 'pill' },
  share: { label: 'Share', icon: 'share-variant-outline' },
};

/** Floating pill tab bar from the Figma prototype: the active tab is a white pill with its label. */
export function PillTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 16) }]} pointerEvents="box-none">
      <LinearGradient colors={gradients.tabBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bar}>
        {state.routes.map((route, i) => {
          const meta = TAB_META[route.name];
          if (!meta) return null;
          const focused = state.index === i;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={meta.label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const e = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) navigateToTab(route.key);
              }}
              style={[styles.tab, focused && styles.active]}>
              <Icon name={meta.icon} size={20} color={focused ? colors.plum : colors.white} />
              {focused ? <Text style={styles.label}>{meta.label}</Text> : null}
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingTop: 4, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 9,
    width: '100%',
    maxWidth: 472,
    ...shadow.tabBar,
  },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 100 },
  active: { backgroundColor: colors.white, paddingHorizontal: 16 },
  label: { fontFamily: fonts.heading, fontSize: 12, color: colors.plum },
});
