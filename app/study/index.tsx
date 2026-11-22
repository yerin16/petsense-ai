import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { normalizeCode, versionFor } from '@/src/study/assign';
import { flushResults, logResult, type FlushResult } from '@/src/study/log';
import type { Experiment } from '@/src/study/types';
import { useStudyStore } from '@/src/study/useStudyStore';
import { Button, Card, Chip, Divider, Icon, PageHeader, Screen, T } from '@/src/ui/components';
import { colors, fonts } from '@/src/ui/theme';

// The order follows the story: will they open it → can they give it data → will they trust it.
// `href` is null until that task's screen is built (trust: step 6).
const SESSIONS: { experiment: Experiment; title: string; blurb: string; minutes: number; href: Href | null }[] = [
  { experiment: 'adoption', title: 'What would you do?', blurb: 'Read a short situation and pick your first step.', minutes: 2, href: '/study/adoption' },
  { experiment: 'logging', title: 'Log a symptom', blurb: 'Record what you notice about a dog, as you would at home.', minutes: 3, href: '/study/logging' },
  { experiment: 'trust', title: 'Read some guidance', blurb: 'Read advice about a dog and decide what to do next.', minutes: 3, href: null },
];

export default function StudyHome() {
  const params = useLocalSearchParams<{ code?: string }>();
  const { participant, setParticipant, queue, done, reopen } = useStudyStore();
  const [draft, setDraft] = useState('');
  const [inputError, setInputError] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [teamOpen, setTeamOpen] = useState(false);

  // A link like /study?code=P03 sets the participant, so each person gets their own link.
  const fromLink = normalizeCode(params.code);
  const code = fromLink ?? participant;

  useEffect(() => {
    if (fromLink && fromLink !== participant) setParticipant(fromLink);
  }, [fromLink, participant, setParticipant]);

  // Retry anything left over from an earlier visit.
  useEffect(() => {
    flushResults();
  }, []);

  const submitCode = () => {
    const c = normalizeCode(draft);
    if (!c) return setInputError(true);
    setInputError(false);
    setDraft('');
    setParticipant(c);
  };

  const describe = (r: FlushResult) =>
    r.ok
      ? `Sent ✓ ${r.sent} row${r.sent === 1 ? '' : 's'} reached the Sheet.`
      : r.error === 'not_configured'
        ? 'Not connected: the Sheet URL isn’t set on the server yet.'
        : r.error === 'offline'
          ? 'No connection. Saved on this device; it will send later.'
          : `Couldn’t send (${r.error}). Saved on this device.`;

  const sendTest = async () => {
    setStatus('Sending…');
    setStatus(describe(await logResult({ experiment: 'test', version: '-', choice: 'connection_test' })));
  };
  const retry = async () => {
    setStatus('Sending…');
    setStatus(describe(await flushResults()));
  };

  if (!code) {
    return (
      <Screen>
        <PageHeader title="PetSense AI study" subtitle="Thanks for helping us test an app for dog owners." />
        <Card>
          <T v="h3">Enter your participant code</T>
          <T v="body">Your tester will give you a code like P03.</T>
          <TextInput
            value={draft}
            onChangeText={(t) => {
              setDraft(t);
              setInputError(false);
            }}
            onSubmitEditing={submitCode}
            placeholder="P03"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            autoCorrect={false}
            style={[styles.input, inputError && { borderColor: colors.coral }]}
          />
          {inputError ? (
            <T v="caption" style={{ color: colors.coral }}>
              That doesn’t look like a code. Try something like P03.
            </T>
          ) : null}
          <Button label="Continue" onPress={submitCode} />
        </Card>
      </Screen>
    );
  }

  const finished = done[code] ?? [];

  return (
    <Screen>
      <PageHeader title="PetSense AI study" subtitle="About 10 minutes. There are no right or wrong answers." />

      <Card style={styles.row}>
        <View style={styles.badge}>
          <Icon name="account-outline" color={colors.violet} />
        </View>
        <View style={{ flex: 1 }}>
          <T v="caption">Participant</T>
          <T v="h3">{code}</T>
        </View>
        <Chip
          label="Not you?"
          onPress={() => {
            setParticipant(null);
            if (params.code) router.setParams({ code: undefined });
          }}
        />
      </Card>

      <T v="overline">YOUR TASKS, IN ORDER</T>
      {SESSIONS.map((s, i) => {
        const isDone = finished.includes(s.experiment);
        // Tasks go in order: a task opens once every task before it is done.
        const isNext = !isDone && SESSIONS.slice(0, i).every((p) => finished.includes(p.experiment));
        const href = isNext ? s.href : null;
        return (
          <Pressable key={s.experiment} disabled={!href} onPress={() => href && router.push(href)}>
            <Card style={[styles.row, { opacity: isDone ? 0.6 : 1 }, href && { borderWidth: 2, borderColor: colors.violet }]}>
              <View style={[styles.num, isDone && { backgroundColor: colors.green }, !isDone && !href && { backgroundColor: colors.rail }]}>
                {isDone ? <Icon name="check" size={16} color={colors.white} /> : <T v="label" style={{ color: colors.white }}>{i + 1}</T>}
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <T v="h3">{s.title}</T>
                <T v="body">{s.blurb}</T>
                <T v="caption">About {s.minutes} min</T>
              </View>
              {isDone ? (
                <Chip label="Done" tone="green" />
              ) : href ? (
                <Icon name="chevron-right" size={22} color={colors.violet} />
              ) : (
                <Chip label={isNext ? 'Coming soon' : 'Later'} />
              )}
            </Card>
          </Pressable>
        );
      })}

      <Pressable onPress={() => setTeamOpen(!teamOpen)} style={[styles.row, { paddingVertical: 8 }]}>
        <T v="caption" style={{ flex: 1 }}>
          For the team
        </T>
        <Icon name={teamOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
      </Pressable>

      {teamOpen ? (
        <Card>
          <T v="h3">Assigned versions for {code}</T>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            {SESSIONS.map((s) => (
              <Chip key={s.experiment} label={`${s.experiment}: ${versionFor(code, s.experiment)}`} />
            ))}
          </View>
          {finished.length > 0 ? (
            <>
              <T v="caption">
                Redo a task only after a technical problem. Only the participant’s earliest row in the Sheet counts.
              </T>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {finished.map((e) => (
                  <Chip key={e} label={`Redo ${e}`} tone="amber" onPress={() => reopen(code, e)} />
                ))}
              </View>
            </>
          ) : null}
          <Divider />
          <T v="body">
            {queue.length === 0
              ? 'Every result from this device has reached the Sheet.'
              : `${queue.length} result${queue.length === 1 ? '' : 's'} saved on this device, not sent yet.`}
          </T>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Button label="Send test row" icon="send" size="sm" onPress={sendTest} />
            {queue.length > 0 ? <Button label="Retry sending" icon="refresh" size="sm" onPress={retry} /> : null}
          </View>
          {status ? (
            <T v="caption" style={{ fontFamily: fonts.bodySemi, color: colors.plum }}>
              {status}
            </T>
          ) : null}
          <T v="caption">Codes starting with T (e.g. T01) are for team trial runs. Filter them out in the Sheet.</T>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lilac, alignItems: 'center', justifyContent: 'center' },
  num: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.violet, alignItems: 'center', justifyContent: 'center' },
  input: {
    borderWidth: 1.5,
    borderColor: colors.lilacLine,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.ink,
    letterSpacing: 1,
  },
});
