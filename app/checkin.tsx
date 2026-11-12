import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dayISO } from '@/src/seed/dates';
import type { CheckIn, Level } from '@/src/seed/types';
import { METRICS } from '@/src/store/selectors';
import { usePetStore } from '@/src/store/usePetStore';
import { Button, Card, Icon, T } from '@/src/ui/components';
import { colors, fonts, gradients } from '@/src/ui/theme';

const LEVEL_TONE = [colors.green, colors.amber, colors.coral];

export default function CheckInSheet() {
  const insets = useSafeAreaInsets();
  const { pet, checkIns, saveCheckIn } = usePetStore();
  const today = dayISO(0);
  const existing = checkIns.find((c) => c.date === today);
  const [draft, setDraft] = useState<CheckIn>(
    existing ?? { date: today, appetite: 0, energy: 0, stool: 0, mobility: 0, water: 0, vomited: 0, note: '' },
  );

  const save = () => {
    saveCheckIn(draft);
    router.back();
  };

  return (
    <LinearGradient colors={gradients.screen} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.body, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <T v="title">Daily check-in</T>
            <T v="body">Compared with {pet.name}’s normal. Tap anything that’s different today.</T>
          </View>
          <Pressable accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
            <Icon name="close" />
          </Pressable>
        </View>

        {METRICS.map(({ key, label, words }) => (
          <Card key={key} style={{ gap: 10 }}>
            <View>
              <T v="h3">{label}</T>
              <T v="caption">Normal for him: {pet.baseline[key]}</T>
            </View>
            <View style={styles.segment}>
              {words.map((w, i) => {
                const on = draft[key] === i;
                return (
                  <Pressable
                    key={w}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    onPress={() => setDraft({ ...draft, [key]: i as Level })}
                    style={[styles.opt, on && { backgroundColor: LEVEL_TONE[i], borderColor: LEVEL_TONE[i] }]}>
                    <T v="caption" style={{ fontFamily: fonts.bodySemi, color: on ? colors.white : colors.plum, textAlign: 'center' }}>
                      {w}
                    </T>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        ))}

        <Card style={{ gap: 10 }}>
          <T v="h3">Vomiting today</T>
          <View style={styles.segment}>
            {[0, 1, 2, 3].map((n) => {
              const on = draft.vomited === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => setDraft({ ...draft, vomited: n })}
                  style={[styles.opt, on && { backgroundColor: n === 0 ? colors.green : colors.coral, borderColor: 'transparent' }]}>
                  <T v="caption" style={{ fontFamily: fonts.bodySemi, color: on ? colors.white : colors.plum, textAlign: 'center' }}>
                    {n === 0 ? 'None' : n === 3 ? '3+' : `${n}×`}
                  </T>
                </Pressable>
              );
            })}
          </View>
          <TextInput
            placeholder="Anything else? (optional)"
            placeholderTextColor={colors.muted}
            value={draft.note}
            onChangeText={(note) => setDraft({ ...draft, note })}
            style={styles.input}
            multiline
          />
        </Card>

        <Button label="Save check-in" size="lg" onPress={save} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 24, gap: 14, maxWidth: 520, width: '100%', alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  segment: { flexDirection: 'row', gap: 8 },
  opt: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.lilacLine,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  input: {
    minHeight: 60,
    borderRadius: 14,
    backgroundColor: colors.lilac,
    padding: 12,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
});
