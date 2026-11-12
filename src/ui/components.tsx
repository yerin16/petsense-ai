import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, TextProps, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, gradients, radius, shadow, space } from './theme';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function Icon({ name, size = 20, color = colors.plum }: { name: IconName; size?: number; color?: string }) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

/** Full-height page with the lilac gradient, safe-area padding, and room for the floating tab bar. */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const content = (
    <View style={[styles.body, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 110 }]}>{children}</View>
  );
  return (
    <LinearGradient colors={gradients.screen} style={{ flex: 1 }}>
      {scroll ? <ScrollView showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
    </LinearGradient>
  );
}

type Variant = 'title' | 'h2' | 'h3' | 'label' | 'body' | 'caption' | 'overline';
const textStyles: Record<Variant, object> = {
  title: { fontFamily: fonts.heading, fontSize: 24, color: colors.ink },
  h2: { fontFamily: fonts.heading, fontSize: 20, color: colors.ink },
  h3: { fontFamily: fonts.heading, fontSize: 15, color: colors.ink },
  label: { fontFamily: fonts.headingMedium, fontSize: 13, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, lineHeight: 17 },
  caption: { fontFamily: fonts.body, fontSize: 11, color: colors.muted },
  overline: { fontFamily: fonts.bodySemi, fontSize: 10, letterSpacing: 0.6, color: colors.violet },
};

export function T({ v = 'body', style, ...rest }: TextProps & { v?: Variant }) {
  return <Text {...rest} style={[textStyles[v], style]} />;
}

export function Card({
  children,
  style,
  tint,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: string;
}) {
  return (
    <View style={[styles.card, tint ? { backgroundColor: tint, boxShadow: undefined } : null, style]}>{children}</View>
  );
}

export function Chip({
  label,
  tone = 'lilac',
  active,
  onPress,
}: {
  label: string;
  tone?: 'lilac' | 'white' | 'coral' | 'green' | 'amber';
  active?: boolean;
  onPress?: () => void;
}) {
  const palette = {
    lilac: [colors.lilac, colors.plum],
    white: [colors.white, colors.plum],
    coral: [colors.coralSoft, colors.coral],
    green: [colors.greenSoft, colors.green],
    amber: [colors.amberSoft, colors.amber],
  }[tone];
  const small = !onPress;
  const textStyle = { fontFamily: fonts.bodySemi, fontSize: small ? 10 : 12 };
  const pad = small ? styles.chipSm : styles.chipLg;
  if (active) {
    return (
      <Pressable onPress={onPress}>
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[pad, styles.pill]}>
          <Text style={[textStyle, { color: colors.white }]}>{label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={[pad, styles.pill, { backgroundColor: palette[0] }]}>
      <Text style={[textStyle, { color: palette[1] }]}>{label}</Text>
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  kind = 'primary',
  icon,
  size = 'md',
  style,
}: {
  label: string;
  onPress?: () => void;
  kind?: 'primary' | 'white' | 'outline' | 'danger';
  icon?: IconName;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}) {
  const pad = { sm: { paddingHorizontal: 14, paddingVertical: 7 }, md: { paddingHorizontal: 18, paddingVertical: 10 }, lg: { paddingVertical: 16 } }[size];
  const fontSize = { sm: 11, md: 13, lg: 15 }[size];
  const fg = kind === 'white' ? colors.plum : colors.white;
  const inner = (
    <>
      {icon ? <Icon name={icon} size={fontSize + 3} color={fg} /> : null}
      <Text style={{ fontFamily: fonts.heading, fontSize, color: fg }}>{label}</Text>
    </>
  );
  const base = [styles.pill, styles.btn, pad];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
      {kind === 'primary' ? (
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={base}>
          {inner}
        </LinearGradient>
      ) : (
        <View
          style={[
            ...base,
            kind === 'white' && { backgroundColor: colors.white },
            kind === 'danger' && { backgroundColor: colors.coral },
            kind === 'outline' && { borderWidth: 1.5, borderColor: colors.white },
          ]}>
          {inner}
        </View>
      )}
    </Pressable>
  );
}

/** Round gradient "+" button used in page headers. */
export function RoundAction({ icon = 'plus', onPress }: { icon?: IconName; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.round}>
        <Icon name={icon} color={colors.white} size={22} />
      </LinearGradient>
    </Pressable>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <T v="title">{title}</T>
        {subtitle ? <T v="body">{subtitle}</T> : null}
      </View>
      {action}
    </View>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.lilacLine, alignSelf: 'stretch' }} />;
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: space.gutter, gap: space.gap, maxWidth: 520, width: '100%', alignSelf: 'center' },
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: 16, gap: 12, ...shadow.card },
  pill: { borderRadius: radius.pill, overflow: 'hidden' },
  chipSm: { paddingHorizontal: 10, paddingVertical: 4 },
  chipLg: { paddingHorizontal: 14, paddingVertical: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  round: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
});
