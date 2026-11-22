import { Redirect, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { versionFor } from '@/src/study/assign';
import { CHOICES, describeTrust, GUIDANCE, REFERENCE, SAFETY, SITUATION, type TrustChoice } from '@/src/study/content/trust';
import { logResult, useStopwatch } from '@/src/study/log';
import { useStudyStore } from '@/src/study/useStudyStore';
import { Button, Card, Icon, Screen, T } from '@/src/ui/components';
import { colors } from '@/src/ui/theme';

const backToTasks = () => (router.canGoBack() ? router.back() : router.replace('/study'));

/**
 * Experiment 3 (trust): a fixed situation and scripted PetSense guidance, then the participant picks
 * what to do. Counts as aligned when they pick the safe answer (monitor). Seconds = decision time.
 */
export default function TrustTask() {
  const { participant, done } = useStudyStore();
  const clock = useStopwatch({ autoStart: true });
  const picked = useRef(false);
  const [finished, setFinished] = useState(false);

  if (!participant) return <Redirect href="/study" />;

  const version = versionFor(participant, 'trust');
  const g = GUIDANCE[version];

  if (!finished && (done[participant] ?? []).includes('trust')) {
    return (
      <Screen>
        <Card>
          <T v="h3">You’ve already done this task</T>
          <T v="body">Thanks! That was the last one.</T>
          <Button label="Back to your tasks" onPress={backToTasks} />
        </Card>
      </Screen>
    );
  }

  const choose = (choice: TrustChoice) => {
    if (picked.current) return;
    picked.current = true;
    logResult({
      experiment: 'trust',
      version,
      choice,
      seconds: clock.seconds(),
      correct: choice === REFERENCE,
      detail: describeTrust(version, choice),
    });
    setFinished(true);
  };

  if (finished) {
    return (
      <Screen>
        <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
          <View style={[styles.badge, { backgroundColor: colors.greenSoft }]}>
            <Icon name="check" size={28} color={colors.green} />
          </View>
          <T v="h2">All done, thank you!</T>
          <T v="body" style={{ textAlign: 'center' }}>
            That was the last task. Biscuit is made up, and this isn’t real medical advice.
          </T>
          <Button label="Back to your tasks" onPress={backToTasks} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <T v="overline">TASK 3 · IMAGINE THIS IS YOUR DOG</T>
      <Card tint={colors.lilac} style={{ gap: 8 }}>
        <T v="h3">{SITUATION.title}</T>
        <T v="body" style={styles.read}>
          {SITUATION.body}
        </T>
      </Card>

      <T v="body">You open PetSense AI and ask:</T>
      <View style={styles.bubble}>
        <T v="body" style={{ color: colors.white, fontSize: 14 }}>
          {SITUATION.question}
        </T>
      </View>

      <Card style={{ gap: 12 }}>
        <View style={styles.row}>
          <View style={[styles.badge, { width: 36, height: 36, backgroundColor: colors.lilac }]}>
            <Icon name="star-four-points-outline" size={18} color={colors.violet} />
          </View>
          <T v="label" style={{ color: colors.violet }}>
            PetSense AI
          </T>
        </View>
        <View style={styles.verdict}>
          <Icon name="home-heart" size={18} color={colors.green} />
          <T v="h3" style={{ color: colors.green }}>
            {g.verdict}
          </T>
        </View>

        <Section title="Why">{g.why}</Section>
        <Section title="What to do">{g.todo}</Section>
        <Section title="Call your vet today if" tone={colors.amber}>
          {SAFETY.callVet}
        </Section>
        <Section title="Go to urgent care now if" tone={colors.coral}>
          {SAFETY.urgent}
        </Section>
        <T v="caption" style={{ fontStyle: 'italic' }}>
          {SAFETY.uncertainty}
        </T>
      </Card>

      <View style={{ gap: 4 }}>
        <T v="h2">What would you do now?</T>
        <T v="body">There’s no trick. Pick what you’d really do.</T>
      </View>
      {CHOICES.map((c) => (
        <Pressable
          key={c.id}
          accessibilityRole="button"
          onPress={() => choose(c.id)}
          style={({ pressed }) => [styles.option, pressed && { opacity: 0.8 }]}>
          <T v="h3" style={{ flex: 1 }}>
            {c.label}
          </T>
          <Icon name="chevron-right" size={20} color={colors.muted} />
        </Pressable>
      ))}
    </Screen>
  );
}

function Section({ title, children, tone = colors.ink }: { title: string; children: string[]; tone?: string }) {
  return (
    <View style={{ gap: 4 }}>
      <T v="label" style={{ color: tone }}>
        {title}
      </T>
      {children.map((line) => (
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
  read: { fontSize: 14, lineHeight: 21, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    backgroundColor: colors.violet,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  verdict: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.greenSoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  // All three options look identical so none is nudged.
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
});
