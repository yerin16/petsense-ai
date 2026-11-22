import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { LEVEL_LABEL, type AnswerMode, type TriageLevel } from '@/src/petsense/types';
import { usePetStore } from '@/src/store/usePetStore';
import { describeEntryShort } from '@/src/symptom/describe';
import { Button, Card, Chip, Icon, type IconName, Screen, T } from '@/src/ui/components';
import { colors } from '@/src/ui/theme';

const LEVEL_STYLE: Record<TriageLevel, { fg: string; bg: string; icon: IconName }> = {
  monitor: { fg: colors.green, bg: colors.greenSoft, icon: 'home-heart' },
  call_vet: { fg: colors.amber, bg: colors.amberSoft, icon: 'phone-outline' },
  emergency: { fg: colors.coral, bg: colors.coralSoft, icon: 'alert-octagon-outline' },
};

const MODE_LABEL: Record<AnswerMode, string> = {
  ai: 'PetSense AI',
  demo: 'Demo answer',
  red_flag: 'Emergency rule',
};

function notify(title: string, msg: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
}

const done = () => router.replace('/petsense');

/** PetSense's answer: one of three levels, why (citing the dog's history), and when to stop waiting. */
export default function Triage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pet, asks, logAsk } = usePetStore();
  const ask = asks.find((a) => a.id === id);
  if (!ask) return <Redirect href="/petsense" />;

  const { result, mode } = ask.response;
  const st = LEVEL_STYLE[result.level];

  return (
    <Screen>
      <View style={styles.row}>
        <T v="overline" style={{ flex: 1 }}>
          {`${describeEntryShort(ask.entry)} · ${ask.time}`.toUpperCase()}
        </T>
        <Chip label={MODE_LABEL[mode]} tone={mode === 'red_flag' ? 'coral' : 'lilac'} />
      </View>

      <View style={[styles.level, { backgroundColor: st.bg }]}>
        <Icon name={st.icon} size={26} color={st.fg} />
        <View style={{ flex: 1 }}>
          <T v="caption" style={{ color: st.fg, fontFamily: 'Montserrat_600SemiBold' }}>
            {LEVEL_LABEL[result.level].toUpperCase()}
          </T>
          <T v="h2" style={{ color: colors.ink }}>
            {result.headline}
          </T>
        </View>
      </View>

      <Card style={{ gap: 14 }}>
        <Section title="Why" items={result.why} />
        <Section title={`From ${pet.name}’s history`} items={result.history} icon="history" />
        <Section title="What to do now" items={result.todo} />
        <Section title="Stop waiting and call your vet if" items={result.call_vet_if} tone={colors.amber} />
        <Section title="Go to emergency now if" items={result.emergency_if} tone={colors.coral} />
        <Section title="Questions for the vet" items={result.questions_for_vet} />
      </Card>

      {result.level === 'emergency' ? (
        <Button
          label={`Call ${pet.emergencyClinic.name}`}
          kind="danger"
          icon="phone"
          size="lg"
          onPress={() => notify(pet.emergencyClinic.name, `Call ${pet.emergencyClinic.phone}\nOpen 24 hours.`)}
        />
      ) : (
        <Button
          label={`Call ${pet.vet.name}`}
          kind={result.level === 'call_vet' ? 'primary' : 'white'}
          icon="phone"
          onPress={() => notify(pet.vet.clinic, `Call ${pet.vet.phone} (demo)`)}
        />
      )}
      <Button
        label={ask.logged ? `Saved to ${pet.name}’s timeline ✓` : `Save to ${pet.name}’s timeline`}
        kind={ask.logged ? 'white' : 'primary'}
        icon={ask.logged ? undefined : 'clock-plus-outline'}
        onPress={() => logAsk(ask.id)}
      />
      <Button label="Done" kind="white" onPress={done} />

      <T v="caption" style={{ textAlign: 'center' }}>
        PetSense is not a vet and can’t examine {pet.name}. It can be wrong. When in doubt, call your vet.
        {mode === 'demo' ? ' This is a prewritten demo answer.' : ''}
      </T>
    </Screen>
  );
}

function Section({ title, items, tone = colors.ink, icon }: { title: string; items: string[]; tone?: string; icon?: IconName }) {
  if (!items.length) return null;
  return (
    <View style={{ gap: 4 }}>
      <View style={[styles.row, { gap: 6 }]}>
        {icon ? <Icon name={icon} size={16} color={colors.violet} /> : null}
        <T v="label" style={{ color: tone, flex: 1 }}>
          {title}
        </T>
      </View>
      {items.map((line) => (
        <View key={line} style={{ flexDirection: 'row', gap: 6 }}>
          <T v="body" style={styles.read}>
            •
          </T>
          <T v="body" style={[styles.read, { flex: 1 }]}>
            {line}
          </T>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  level: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, padding: 16 },
  read: { fontSize: 14, lineHeight: 21, color: colors.ink },
});
