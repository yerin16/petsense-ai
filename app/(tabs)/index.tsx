import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Alert, Image, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ageYears, dayISO, relDue } from '@/src/seed/dates';
import { adherence, dueToday, recentVsNormal, streak } from '@/src/store/selectors';
import { usePetStore } from '@/src/store/usePetStore';
import { Button, Card, Chip, Divider, Icon, Screen, T } from '@/src/ui/components';
import { colors, gradients, radius, shadow } from '@/src/ui/theme';

const photo = require('@/assets/images/biscuit.png');

function notify(title: string, msg: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
}

export default function Home() {
  const { pet, checkIns, meds, reminders, snoozed, toggleDose, snooze, resetDemo } = usePetStore();
  const today = dayISO(0);
  const reminder = reminders.find((r) => !snoozed.includes(r.id));
  const todaysMeds = meds.filter((m) => dueToday(m));
  const givenCount = todaysMeds.filter((m) => m.given[today]).length;
  const loggedToday = checkIns.some((c) => c.date === today);
  const summary = recentVsNormal(checkIns);
  const flagged = summary.filter((s) => s.level > 0 && !s.usual);
  const days = streak(checkIns);

  return (
    <Screen>
      {/* Pet header */}
      <View style={styles.row}>
        <Image source={photo} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <T v="h2">{pet.name}</T>
          <T v="body">
            {pet.breed} · {ageYears(pet.dob)} yrs
          </T>
        </View>
        <Button
          label="Emergency"
          kind="danger"
          icon="plus-circle-outline"
          size="sm"
          onPress={() => notify(pet.emergencyClinic.name, `Call ${pet.emergencyClinic.phone}\nOpen 24 hours.`)}
        />
      </View>

      {/* Should I wait? (PetSense) */}
      <Pressable accessibilityRole="button" onPress={() => router.push('/symptom')}>
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.row}>
            <View style={styles.heroIcon}>
              <Icon name="star-four-points-outline" color={colors.white} size={22} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T v="h3" style={{ color: colors.white, fontSize: 16 }}>
                Something new? Should I wait?
              </T>
              <T v="caption" style={{ color: colors.onDarkMuted }}>
                {flagged.length
                  ? `Lately: ${flagged.map((f) => f.label.toLowerCase()).join(', ')}. PetSense checks it against ${pet.name}’s history.`
                  : `PetSense checks it against ${pet.name}’s history: watch, call the vet, or go now.`}
              </T>
            </View>
            <Icon name="chevron-right" color={colors.white} />
          </View>
        </LinearGradient>
      </Pressable>

      {/* Due soon */}
      {reminder ? (
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.row}>
            <View style={styles.heroIcon}>
              <Icon name="calendar-blank-outline" color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <T v="h3" style={{ color: colors.white, fontSize: 14 }}>
                {reminder.title} {relDue(reminder.dueDate)}
              </T>
              <T v="caption" style={{ color: colors.onDarkMuted }}>
                Yearly kidney + liver panel for senior dogs
              </T>
            </View>
          </View>
          <View style={[styles.row, { justifyContent: 'flex-start', gap: 10 }]}>
            <Button
              label="Book vet"
              kind="white"
              onPress={() => notify('Book with Sunny Paws', `Call ${pet.vet.phone} (demo)`)}
            />
            <Button label="Remind me later" kind="outline" onPress={() => snooze(reminder.id)} />
          </View>
        </LinearGradient>
      ) : null}

      {/* Today vs. normal */}
      <Card>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <T v="h3">Lately vs. {pet.name}’s normal</T>
            <T v="caption">Last 3 check-ins · {days}-day streak</T>
          </View>
          {flagged.length ? <Chip label={`${flagged.length} change${flagged.length > 1 ? 's' : ''}`} tone="amber" /> : <Chip label="All normal" tone="green" />}
        </View>
        {summary.map((s) => (
          <View key={s.key} style={styles.row}>
            <View
              style={[
                styles.dot,
                { backgroundColor: s.level === 0 || s.usual ? colors.green : s.level === 1 ? colors.amber : colors.coral },
              ]}
            />
            <T v="label" style={{ width: 72 }}>
              {s.label}
            </T>
            <T v="body" style={{ flex: 1, textAlign: 'right' }}>
              {s.text}
            </T>
          </View>
        ))}
        <Button
          label={loggedToday ? 'Edit today’s check-in' : 'Log today’s check-in · 30 sec'}
          icon="clipboard-check-outline"
          onPress={() => router.push('/checkin')}
        />
      </Card>

      {/* Today's meds */}
      <Card>
        <View style={styles.row}>
          <T v="h3">Today’s meds</T>
          <T v="body">
            {givenCount} of {todaysMeds.length} given
          </T>
        </View>
        {todaysMeds.map((m, i) => {
          const given = m.given[today];
          return (
            <View key={m.id} style={{ gap: 12 }}>
              {i > 0 ? <Divider /> : null}
              <View style={styles.row}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: !!given }}
                  onPress={() => toggleDose(m.id)}
                  style={[styles.check, given ? styles.checkOn : styles.checkOff]}>
                  {given ? <Icon name="check" color={colors.white} size={16} /> : null}
                </Pressable>
                <View style={{ flex: 1 }}>
                  <T v="label">{m.name}</T>
                  <T v="caption">{m.scheduleLabel.replace('Daily at ', '')}</T>
                </View>
                {given ? (
                  <T v="body" style={{ color: colors.green, fontFamily: 'Montserrat_600SemiBold' }}>
                    Given
                  </T>
                ) : (
                  <Button label="Mark given" size="sm" onPress={() => toggleDose(m.id)} />
                )}
              </View>
            </View>
          );
        })}
        {adherence(meds, dayISO(-1)) === 'missed' ? (
          <T v="caption" style={{ color: colors.coral }}>
            A dose was missed yesterday
          </T>
        ) : null}
      </Card>

      <View style={[styles.row, { justifyContent: 'center', gap: 20 }]}>
        <Pressable onPress={resetDemo} style={{ padding: 8 }}>
          <T v="caption">Reset demo data</T>
        </Pressable>
        <Pressable onPress={() => router.push('/presenter')} style={{ padding: 8 }}>
          <T v="caption">Presenter mode</T>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: colors.white },
  hero: { borderRadius: radius.hero, padding: 18, gap: 14, ...shadow.card },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  check: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.green },
  checkOff: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.lilacLine },
});
