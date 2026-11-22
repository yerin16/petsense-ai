import { Redirect, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { versionFor } from '@/src/study/assign';
import { INTRO, optionOrder, SCENARIOS, type AdoptionChoice } from '@/src/study/content/adoption';
import { logResult, useStopwatch } from '@/src/study/log';
import { useStudyStore } from '@/src/study/useStudyStore';
import { Button, Card, Icon, Screen, T } from '@/src/ui/components';
import { colors } from '@/src/ui/theme';

type Phase = 'intro' | 'scenario' | 'done';

const backToTasks = () => (router.canGoBack() ? router.back() : router.replace('/study'));

/** Experiment 1 (adoption): intro → one made-up symptom → "What would you do first?" Only the first click counts. */
export default function AdoptionTask() {
  const { participant, done } = useStudyStore();
  const [phase, setPhase] = useState<Phase>('intro');
  const [picked, setPicked] = useState<AdoptionChoice | null>(null);
  const introClock = useStopwatch({ autoStart: true });
  const choiceClock = useStopwatch();

  const order = useMemo(() => (participant ? optionOrder(participant) : []), [participant]);

  if (!participant) return <Redirect href="/study" />;

  const version = versionFor(participant, 'adoption');
  const scenario = SCENARIOS[version];
  const alreadyDone = (done[participant] ?? []).includes('adoption') && phase !== 'done';

  if (alreadyDone) {
    return (
      <Screen>
        <Card>
          <T v="h3">You’ve already done this task</T>
          <T v="body">Thanks! Head back to see what’s next.</T>
          <Button label="Back to your tasks" onPress={backToTasks} />
        </Card>
      </Screen>
    );
  }

  const choose = (choice: AdoptionChoice) => {
    if (picked) return; // only the first click counts
    setPicked(choice);
    logResult({
      experiment: 'adoption',
      version,
      choice,
      seconds: choiceClock.seconds(),
      detail: JSON.stringify({ scenario: scenario.key, order: order.map((o) => o.id), intro_seconds: introClock.seconds() }),
    });
    setPhase('done');
  };

  if (phase === 'intro') {
    return (
      <Screen>
        <T v="overline">TASK 1 · PLEASE READ</T>
        <Card style={{ gap: 14 }}>
          <View style={styles.logo}>
            <Icon name="star-four-points-outline" size={26} color={colors.violet} />
          </View>
          <View style={{ gap: 4 }}>
            <T v="title">{INTRO.title}</T>
            <T v="label" style={{ color: colors.violet }}>
              {INTRO.tagline}
            </T>
          </View>
          {INTRO.body.map((p) => (
            <T key={p} v="body" style={styles.read}>
              {p}
            </T>
          ))}
        </Card>
        <Button
          label="Continue"
          size="lg"
          onPress={() => {
            choiceClock.start();
            setPhase('scenario');
          }}
        />
      </Screen>
    );
  }

  if (phase === 'scenario') {
    return (
      <Screen>
        <T v="overline">TASK 1 · IMAGINE THIS IS YOUR DOG</T>
        <Card style={{ gap: 8 }}>
          <T v="h3">{scenario.title}</T>
          <T v="body" style={styles.read}>
            {scenario.body}
          </T>
        </Card>
        <View style={{ gap: 4 }}>
          <T v="h2">What would you do first?</T>
          <T v="body">This is a made-up situation, and there’s no right answer. Tap what you’d really do.</T>
        </View>
        {order.map((o) => (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            onPress={() => choose(o.id)}
            style={({ pressed }) => [styles.option, pressed && { opacity: 0.8 }]}>
            <View style={styles.optionIcon}>
              <Icon name={o.icon} size={22} color={colors.plum} />
            </View>
            <T v="h3" style={{ flex: 1 }}>
              {o.label}
            </T>
            <Icon name="chevron-right" size={20} color={colors.muted} />
          </Pressable>
        ))}
      </Screen>
    );
  }

  return (
    <Screen>
      <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
        <View style={[styles.logo, { backgroundColor: colors.greenSoft }]}>
          <Icon name="check" size={28} color={colors.green} />
        </View>
        <T v="h2">Got it, thank you!</T>
        <T v="body" style={{ textAlign: 'center' }}>
          Your answer is saved. Head back for the next task.
        </T>
        <Button label="Back to your tasks" onPress={backToTasks} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.lilac, alignItems: 'center', justifyContent: 'center' },
  read: { fontSize: 14, lineHeight: 21, color: colors.ink },
  // All four options look identical so none stands out (experiment card: "equally prominent").
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.lilacLine,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lilac, alignItems: 'center', justifyContent: 'center' },
});
