import { Redirect, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { versionFor } from '@/src/study/assign';
import { checkAccuracy, LIMIT_SECONDS, TASK } from '@/src/study/content/logging';
import { logResult, useStopwatch } from '@/src/study/log';
import { useStudyStore } from '@/src/study/useStudyStore';
import { SymptomForm } from '@/src/symptom/SymptomForm';
import type { SymptomEntry } from '@/src/symptom/types';
import { Button, Card, Icon, Screen, T } from '@/src/ui/components';
import { colors } from '@/src/ui/theme';

const backToTasks = () => (router.canGoBack() ? router.back() : router.replace('/study'));

/**
 * Experiment 2 (logging): the timer starts when the task appears and stops at "Saved ✓".
 * Pass = accurate log, without help, in ≤ 120 s. A = text-first form, B = tap-to-pick form.
 */
export default function LoggingTask() {
  const { participant, done } = useStudyStore();
  const clock = useStopwatch({ autoStart: true });
  const errors = useRef(0);
  const submitted = useRef(false); // guards against a fast double tap logging two rows
  const [result, setResult] = useState<'saved' | 'gave_up' | null>(null);

  if (!participant) return <Redirect href="/study" />;

  const version = versionFor(participant, 'logging');
  const layout = version === 'A' ? 'text' : 'tap';

  if (!result && (done[participant] ?? []).includes('logging')) {
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

  const save = (entry: SymptomEntry) => {
    if (submitted.current) return;
    submitted.current = true;
    const seconds = clock.seconds();
    const { correct, checks } = checkAccuracy(entry);
    logResult({
      experiment: 'logging',
      version,
      choice: 'saved',
      seconds,
      correct,
      detail: JSON.stringify({ ...entry, checks, errors: errors.current, within_limit: seconds <= LIMIT_SECONDS }),
    });
    setResult('saved');
  };

  const giveUp = () => {
    if (submitted.current) return;
    submitted.current = true;
    logResult({
      experiment: 'logging',
      version,
      choice: 'gave_up',
      seconds: clock.seconds(),
      correct: false,
      detail: JSON.stringify({ layout, errors: errors.current }),
    });
    setResult('gave_up');
  };

  if (result) {
    return (
      <Screen>
        <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
          <View style={styles.badge}>
            <Icon name={result === 'saved' ? 'check' : 'hand-wave-outline'} size={28} color={colors.green} />
          </View>
          <T v="h2">{result === 'saved' ? 'Saved ✓' : 'No problem, thank you!'}</T>
          <T v="body" style={{ textAlign: 'center' }}>
            {result === 'saved' ? 'Your log is saved. Head back for the next task.' : 'Head back for the next task.'}
          </T>
          <Button label="Back to your tasks" onPress={backToTasks} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <T v="overline">TASK 2 · LOG A SYMPTOM</T>
      <Card tint={colors.lilac} style={{ gap: 8 }}>
        <T v="body" style={styles.read}>
          {TASK.story}
        </T>
        <T v="h3">{TASK.instruction}</T>
      </Card>

      <SymptomForm
        layout={layout}
        petName={TASK.petName}
        onSave={save}
        onInvalid={() => {
          errors.current += 1;
        }}
      />

      <Pressable onPress={giveUp} style={{ alignSelf: 'center', padding: 8 }}>
        <T v="caption" style={{ textDecorationLine: 'underline' }}>
          I can’t finish this
        </T>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  read: { fontSize: 14, lineHeight: 21, color: colors.ink },
  badge: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
});
