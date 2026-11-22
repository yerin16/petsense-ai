import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { askPetSense } from '@/src/petsense/ask';
import { dayISO, nowTime } from '@/src/seed/dates';
import { usePetStore } from '@/src/store/usePetStore';
import { SymptomForm } from '@/src/symptom/SymptomForm';
import type { SymptomEntry } from '@/src/symptom/types';
import { Card, Icon, PageHeader, Screen, T } from '@/src/ui/components';
import { colors } from '@/src/ui/theme';

/** "Something new? Should I wait?" Log the symptom, then PetSense answers using the dog's history. */
export default function NewSymptom() {
  const { pet, addAsk } = usePetStore();
  const [thinking, setThinking] = useState(false);
  const busy = useRef(false);

  const save = async (entry: SymptomEntry) => {
    if (busy.current) return;
    busy.current = true;
    setThinking(true);
    const response = await askPetSense(entry);
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    addAsk({ id, date: dayISO(0), time: nowTime(), entry, response, logged: false });
    router.replace({ pathname: '/triage/[id]', params: { id } });
  };

  if (thinking) {
    return (
      <Screen>
        <Card style={{ alignItems: 'center', paddingVertical: 40, gap: 16 }}>
          <View style={styles.badge}>
            <Icon name="star-four-points-outline" size={26} color={colors.violet} />
          </View>
          <ActivityIndicator color={colors.violet} />
          <T v="h3">Checking {pet.name}’s history…</T>
          <T v="body" style={{ textAlign: 'center' }}>
            Comparing this with his check-ins, conditions, meds and past flare-ups.
          </T>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageHeader
        title="Something new?"
        subtitle={`Tell PetSense what you noticed. It checks ${pet.name}’s history and tells you whether to wait.`}
        action={
          <Pressable accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
            <Icon name="close" />
          </Pressable>
        }
      />
      <SymptomForm layout="tap" petName={pet.name} onSave={save} />
      <T v="caption" style={{ textAlign: 'center' }}>
        If {pet.name} collapses, can’t breathe, or his belly looks swollen, call the emergency clinic now.
      </T>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.lilac, alignItems: 'center', justifyContent: 'center' },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});
