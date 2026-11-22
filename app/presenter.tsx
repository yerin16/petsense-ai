import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { verifyPasscode } from '@/src/petsense/ask';
import { usePresenter } from '@/src/petsense/usePresenter';
import { Button, Card, Chip, Icon, PageHeader, Screen, T } from '@/src/ui/components';
import { colors, fonts } from '@/src/ui/theme';

/** Presenter mode: enter the team passcode once on this device to get live AI answers. */
export default function Presenter() {
  const { passcode, setPasscode } = usePresenter();
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const submit = async () => {
    const p = draft.trim();
    if (!p) return;
    setStatus('Checking…');
    const res = await verifyPasscode(p);
    if (!res) return setStatus('Couldn’t reach the server. Try again.');
    if (!res.ok) return setStatus('That passcode isn’t right.');
    setPasscode(p);
    setDraft('');
    setStatus(res.aiConfigured ? 'Live AI is on for this device.' : 'Passcode saved, but the AI key isn’t set on the server yet.');
  };

  return (
    <Screen>
      <PageHeader
        title="Presenter mode"
        subtitle="For the team only."
        action={
          <Pressable accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
            <Icon name="close" />
          </Pressable>
        }
      />
      <Card>
        <View style={styles.row}>
          <T v="h3" style={{ flex: 1 }}>
            PetSense answers on this device
          </T>
          <Chip label={passcode ? 'Live AI' : 'Demo answers'} tone={passcode ? 'green' : 'lilac'} />
        </View>
        <T v="body">
          Without the passcode, PetSense gives prewritten demo answers, which cost nothing. With it, the server asks Claude
          using Biscuit’s history. Emergency rules always run first.
        </T>
      </Card>

      {passcode ? (
        <Button
          label="Turn off live AI on this device"
          kind="white"
          onPress={() => {
            setPasscode(null);
            setStatus('Back to demo answers.');
          }}
        />
      ) : (
        <Card>
          <T v="h3">Team passcode</T>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={submit}
            placeholder="Passcode"
            placeholderTextColor={colors.muted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <Button label="Turn on live AI" onPress={submit} />
        </Card>
      )}
      {status ? (
        <T v="caption" style={{ textAlign: 'center', fontFamily: fonts.bodySemi, color: colors.plum }}>
          {status}
        </T>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  input: {
    borderWidth: 1.5,
    borderColor: colors.lilacLine,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
  },
});
