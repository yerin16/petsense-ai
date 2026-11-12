import { View } from 'react-native';

import { Card, Chip, Icon, PageHeader, Screen, T } from '@/src/ui/components';
import { colors } from '@/src/ui/theme';

// Placeholder until milestone 3 (red-flag rules + Claude-powered triage).
export default function PetSense() {
  return (
    <Screen>
      <PageHeader title="PetSense" subtitle="Know whether to watch, call, or go." />
      <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
        <View
          style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.lilac, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="star-four-points-outline" size={28} color={colors.violet} />
        </View>
        <T v="h3">Coming in milestone 3</T>
        <T v="body" style={{ textAlign: 'center' }}>
          Describe what you’re seeing. PetSense compares it with Biscuit’s check-ins, conditions and meds, then gives one
          of three answers.
        </T>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip label="Monitor at home" tone="green" />
          <Chip label="Call your vet today" tone="amber" />
          <Chip label="Go to emergency now" tone="coral" />
        </View>
      </Card>
    </Screen>
  );
}
