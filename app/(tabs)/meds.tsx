import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { dayISO, dayLetter, dayNum, fmtShort } from '@/src/seed/dates';
import type { Med } from '@/src/seed/types';
import { adherence, dueToday } from '@/src/store/selectors';
import { usePetStore } from '@/src/store/usePetStore';
import { Button, Card, Chip, Icon, PageHeader, RoundAction, Screen, T } from '@/src/ui/components';
import { colors, gradients, radius, shadow } from '@/src/ui/theme';

function notify(title: string, msg: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
}

export default function Meds() {
  const { meds, toggleDose, pet } = usePetStore();
  const today = dayISO(0);
  const week = Array.from({ length: 7 }, (_, i) => dayISO(i - 6));
  const daily = meds.filter((m) => m.schedule === 'daily');
  const weekDoses = week.flatMap((d) => daily.map((m) => Boolean(m.given[d])));
  const active = meds.filter((m) => m.schedule !== 'as-needed').length;

  return (
    <Screen>
      <PageHeader
        title="Medications"
        subtitle={`${active} active · ${weekDoses.filter(Boolean).length} of ${weekDoses.length} doses this week`}
        action={<RoundAction />}
      />

      {/* Week strip */}
      <View style={styles.week}>
        {week.map((d) => {
          const isToday = d === today;
          const a = adherence(meds, d);
          const dotColor = isToday ? (a === 'all' ? colors.green : colors.onDarkMuted) : a === 'all' ? colors.green : colors.coral;
          const inner = (
            <>
              <T v="caption" style={{ fontSize: 10, color: isToday ? colors.onDarkMuted : colors.muted }}>
                {dayLetter(d)}
              </T>
              <T v="h3" style={{ fontSize: 14, color: isToday ? colors.white : colors.ink }}>
                {dayNum(d)}
              </T>
              <View style={[styles.dot, { backgroundColor: dotColor }]} />
            </>
          );
          return isToday ? (
            <LinearGradient key={d} colors={gradients.primary} style={styles.day}>
              {inner}
            </LinearGradient>
          ) : (
            <View key={d} style={styles.day}>
              {inner}
            </View>
          );
        })}
      </View>

      {meds.filter((m) => m.schedule !== 'as-needed').map((m) => (
        <MedCard key={m.id} med={m} today={today} onToggle={() => toggleDose(m.id)} onRefill={() => notify('Refill requested', `Sent to ${pet.vet.clinic} for ${m.name}. (demo)`)} />
      ))}

      <T v="h3" style={{ marginTop: 6 }}>
        Flare-up plans
      </T>
      {meds
        .filter((m) => m.protocol)
        .map((m) => (
          <Card key={m.id}>
            <View style={styles.row}>
              <View style={styles.medIcon}>
                <Icon name="stomach" color={colors.amber} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <T v="h3">{m.protocol!.title}</T>
                <T v="caption">
                  Uses {m.name} · {m.stockLeft} left
                </T>
              </View>
            </View>
            {m.protocol!.steps.map((s, i) => (
              <View key={s} style={[styles.row, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
                <View style={styles.stepNum}>
                  <T v="caption" style={{ color: colors.plum, fontFamily: 'Montserrat_600SemiBold' }}>
                    {i + 1}
                  </T>
                </View>
                <T v="body" style={{ flex: 1, color: colors.ink }}>
                  {s}
                </T>
              </View>
            ))}
            <View style={styles.callVet}>
              <T v="overline" style={{ color: colors.coral }}>
                CALL THE VET IF
              </T>
              {m.protocol!.callVetIf.map((c) => (
                <T key={c} v="body" style={{ color: colors.ink }}>
                  • {c}
                </T>
              ))}
            </View>
            <T v="caption">Last used {Object.keys(m.given).sort().slice(-1).map(fmtShort)[0] ?? 'never'}</T>
          </Card>
        ))}
    </Screen>
  );
}

function MedCard({ med: m, today, onToggle, onRefill }: { med: Med; today: string; onToggle: () => void; onRefill: () => void }) {
  const given = m.given[today];
  const due = dueToday(m, today);
  const low = m.stockLeft / m.stockTotal <= 0.25;
  const perDay = m.schedule === 'daily' ? 1 : 1 / 30;
  const runsOut = dayISO(Math.floor(m.stockLeft / perDay));
  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.medIcon}>
          <Icon name="pill" color={colors.plum} size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <T v="h3">{m.name}</T>
          <T v="caption">
            {m.dose} · {m.purpose}
          </T>
        </View>
        {given ? (
          <Chip label={`Given ${given}`} tone="green" />
        ) : due ? (
          <Chip label="Due today" tone="coral" />
        ) : (
          <Chip label={m.schedule === 'monthly' ? 'Next: the 15th' : 'Not due'} />
        )}
      </View>
      <View style={[styles.row, { justifyContent: 'flex-start', gap: 8 }]}>
        <Icon name="clock-outline" size={16} color={colors.muted} />
        <T v="body">{m.scheduleLabel}</T>
      </View>
      <View style={styles.stockTrack}>
        {low ? (
          <View style={[styles.stockFill, { width: `${(m.stockLeft / m.stockTotal) * 100}%`, backgroundColor: colors.coral }]} />
        ) : (
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.stockFill, { width: `${(m.stockLeft / m.stockTotal) * 100}%` }]}
          />
        )}
      </View>
      <View style={styles.row}>
        <T v="caption" style={{ flex: 1, fontFamily: 'Montserrat_600SemiBold', color: low ? colors.coral : colors.muted }}>
          {m.stockLeft} left · runs out {fmtShort(runsOut)}
        </T>
        {low ? (
          <Button label="Request refill" icon="refresh" size="sm" onPress={onRefill} />
        ) : due ? (
          <Button label={given ? 'Undo' : 'Mark given'} size="sm" onPress={onToggle} />
        ) : null}
      </View>
      {low && due ? (
        <Button label={given ? 'Undo today’s dose' : 'Mark today’s dose given'} kind="primary" size="sm" onPress={onToggle} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  week: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...shadow.card,
  },
  day: { alignItems: 'center', gap: 6, padding: 6, borderRadius: 14, minWidth: 34, overflow: 'hidden' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  medIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lilac, alignItems: 'center', justifyContent: 'center' },
  stockTrack: { height: 6, borderRadius: 3, backgroundColor: colors.lilac, overflow: 'hidden' },
  stockFill: { height: 6, borderRadius: 3 },
  stepNum: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.lilac, alignItems: 'center', justifyContent: 'center' },
  callVet: { backgroundColor: colors.coralSoft, borderRadius: radius.cardSm - 6, padding: 12, gap: 4 },
});
