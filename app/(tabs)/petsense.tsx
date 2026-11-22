import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { LEVEL_LABEL, type TriageLevel } from '@/src/petsense/types';
import { usePresenter } from '@/src/petsense/usePresenter';
import { fmtShort } from '@/src/seed/dates';
import { usePetStore } from '@/src/store/usePetStore';
import { describeEntryShort } from '@/src/symptom/describe';
import { Button, Card, Chip, Divider, Icon, PageHeader, Screen, T } from '@/src/ui/components';
import { colors, gradients, radius, shadow } from '@/src/ui/theme';

const TONE: Record<TriageLevel, 'green' | 'amber' | 'coral'> = { monitor: 'green', call_vet: 'amber', emergency: 'coral' };

const STEPS = [
  { icon: 'clipboard-text-outline', text: 'You log what you noticed. It takes about 30 seconds.' },
  { icon: 'alert-octagon-outline', text: 'Emergency signs are checked first and go straight to “Go now”.' },
  { icon: 'history', text: 'Otherwise PetSense compares it with his check-ins, conditions, meds and vet plans.' },
  { icon: 'sign-direction', text: 'You get one answer: monitor, call the vet, or go now, plus when to stop waiting.' },
] as const;

export default function PetSense() {
  const { pet, asks } = usePetStore();
  const live = Boolean(usePresenter((s) => s.passcode));

  return (
    <Screen>
      <PageHeader title="PetSense AI" subtitle={`Should I wait? Answers based on ${pet.name}’s own history.`} />

      <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <T v="h2" style={{ color: colors.white }}>
          Noticed something new?
        </T>
        <T v="body" style={{ color: colors.onDarkMuted }}>
          Vomiting, limping, not eating, drinking more… Tell PetSense and get a clear next step.
        </T>
        <Button label="Ask PetSense" kind="white" icon="star-four-points-outline" onPress={() => router.push('/symptom')} />
      </LinearGradient>

      <Card>
        <View style={styles.row}>
          <T v="h3" style={{ flex: 1 }}>
            Recent answers
          </T>
          <Chip label={live ? 'Live AI' : 'Demo answers'} tone={live ? 'green' : 'lilac'} />
        </View>
        {asks.length === 0 ? (
          <T v="body">Nothing yet. Your questions and PetSense’s answers will show up here.</T>
        ) : (
          asks.slice(0, 6).map((a, i) => (
            <View key={a.id} style={{ gap: 12 }}>
              {i > 0 ? <Divider /> : null}
              <Pressable
                onPress={() => router.push({ pathname: '/triage/[id]', params: { id: a.id } })}
                style={[styles.row, { alignItems: 'flex-start' }]}>
                <View style={{ flex: 1, gap: 4 }}>
                  <T v="label">{describeEntryShort(a.entry)}</T>
                  <T v="caption">
                    {fmtShort(a.date)} · {a.time}
                    {a.logged ? ' · on timeline' : ''}
                  </T>
                </View>
                <Chip label={LEVEL_LABEL[a.response.result.level]} tone={TONE[a.response.result.level]} />
              </Pressable>
            </View>
          ))
        )}
      </Card>

      <Card>
        <T v="h3">How PetSense decides</T>
        {STEPS.map((s) => (
          <View key={s.text} style={[styles.row, { alignItems: 'flex-start' }]}>
            <View style={styles.stepIcon}>
              <Icon name={s.icon} size={18} color={colors.violet} />
            </View>
            <T v="body" style={{ flex: 1, color: colors.ink }}>
              {s.text}
            </T>
          </View>
        ))}
        <T v="caption">PetSense is not a vet and doesn’t diagnose. When in doubt, it picks the more cautious answer.</T>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hero: { borderRadius: radius.hero, padding: 18, gap: 12, ...shadow.card },
  stepIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.lilac, alignItems: 'center', justifyContent: 'center' },
});
