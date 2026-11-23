import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { daysFromToday, fmtUpper, relDue } from '@/src/seed/dates';
import type { EventKind } from '@/src/seed/types';
import { usePetStore } from '@/src/store/usePetStore';
import { Card, Chip, PageHeader, RoundAction, Screen, T } from '@/src/ui/components';
import { colors } from '@/src/ui/theme';

const TAG_LABEL: Record<EventKind, string> = {
  visit: 'Visit',
  vaccine: 'Vaccine',
  med: 'Medication',
  flare: 'Flare-up',
  lab: 'Lab',
  weight: 'Weight',
  symptom: 'New symptom',
};

const FILTERS: { key: 'all' | EventKind; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'flare', label: 'Flare-ups' },
  { key: 'visit', label: 'Visits' },
  { key: 'med', label: 'Meds' },
  { key: 'lab', label: 'Labs' },
  { key: 'vaccine', label: 'Vaccines' },
];

export default function Timeline() {
  const events = usePetStore((s) => s.timeline);
  const [filter, setFilter] = useState<'all' | EventKind>('all');
  const shown = events
    .filter((e) => filter === 'all' || e.tags.includes(filter))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Screen>
      <PageHeader title="Health timeline" action={<RoundAction label="Log a new symptom" onPress={() => router.push('/symptom')} />} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginHorizontal: -24 }}>
        <View style={{ width: 16 }} />
        {FILTERS.map((f) => (
          <Chip key={f.key} label={f.label} tone="white" active={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
        <View style={{ width: 16 }} />
      </ScrollView>

      <View>
        {shown.map((e, i) => {
          const last = i === shown.length - 1;
          const upcoming = e.upcoming && daysFromToday(e.date) >= 0;
          return (
            <View key={e.id} style={styles.event}>
              <View style={styles.rail}>
                <View style={[styles.node, upcoming ? styles.nodeUpcoming : null]} />
                {!last ? <View style={styles.line} /> : null}
              </View>
              <Card tint={upcoming ? colors.coralSoft : undefined} style={styles.card}>
                <T v="overline" style={upcoming ? { color: colors.coral } : null}>
                  {upcoming ? `UPCOMING · ${fmtUpper(e.date)}` : fmtUpper(e.date)}
                </T>
                <T v="label" style={{ fontSize: 14 }}>
                  {e.title}
                </T>
                <T v="caption" style={{ lineHeight: 16 }}>
                  {e.detail}
                </T>
                <View style={styles.tags}>
                  {upcoming ? (
                    <Chip label={`Due ${relDue(e.date)}`} tone="white" />
                  ) : (
                    e.tags.map((t) => <Chip key={t} label={TAG_LABEL[t]} tone={t === 'flare' || t === 'symptom' ? 'amber' : 'lilac'} />)
                  )}
                </View>
              </Card>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  event: { flexDirection: 'row', gap: 12, paddingBottom: 10 },
  rail: { width: 14, alignItems: 'center' },
  node: { marginTop: 18, width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: colors.plum, backgroundColor: colors.white },
  nodeUpcoming: { borderColor: colors.white, backgroundColor: colors.coral },
  line: { flex: 1, width: 2, backgroundColor: colors.rail, marginTop: 4, marginBottom: -28 },
  card: { flex: 1, padding: 14, gap: 4, borderRadius: 20 },
  tags: { flexDirection: 'row', gap: 6, paddingTop: 4, flexWrap: 'wrap' },
});
