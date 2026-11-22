import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Button, Card, Icon, T } from '@/src/ui/components';
import { colors, fonts } from '@/src/ui/theme';

import { STARTED, SYMPTOMS, type Started, type SymptomEntry, type SymptomKey } from './types';

type Props = {
  /** 'text' = version A (type what's going on), 'tap' = version B (pick symptoms). */
  layout: 'text' | 'tap';
  petName: string;
  onSave: (entry: SymptomEntry) => void;
  /** Called when Save is tapped with something required missing (counted as an error in the study). */
  onInvalid?: (missing: string[]) => void;
};

/** New-symptom log. Used by the logging experiment now, and by the PetSense "Should I wait?" flow later. */
export function SymptomForm({ layout, petName, onSave, onInvalid }: Props) {
  const [text, setText] = useState('');
  const [symptoms, setSymptoms] = useState<SymptomKey[]>([]);
  const [vomitCount, setVomitCount] = useState<number | null>(null);
  const [started, setStarted] = useState<Started | null>(null);
  const [note, setNote] = useState('');
  const [missing, setMissing] = useState<string[]>([]);

  const toggle = (k: SymptomKey) => {
    setSymptoms((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
    if (k === 'vomiting') setVomitCount(null);
    setMissing((m) => m.filter((x) => x !== 'what'));
  };

  const save = () => {
    const need: string[] = [];
    if (layout === 'text' ? text.trim().length < 3 : symptoms.length === 0) need.push('what');
    if (layout === 'tap' && symptoms.includes('vomiting') && vomitCount === null) need.push('count');
    if (!started) need.push('when');
    if (need.length) {
      setMissing(need);
      onInvalid?.(need);
      return;
    }
    onSave({ layout, text: text.trim(), symptoms, vomitCount, started: started!, note: note.trim() });
  };

  const err = (key: string) => missing.includes(key);

  return (
    <View style={{ gap: 14 }}>
      {layout === 'text' ? (
        <Card style={[{ gap: 10 }, err('what') && styles.errCard]}>
          <T v="h3">What’s going on with {petName}?</T>
          <TextInput
            value={text}
            onChangeText={(t) => {
              setText(t);
              setMissing((m) => m.filter((x) => x !== 'what'));
            }}
            placeholder="Describe what you noticed, e.g. what happened and how many times"
            placeholderTextColor={colors.muted}
            multiline
            style={[styles.input, { minHeight: 110 }]}
          />
          {err('what') ? <ErrText>Describe what you noticed.</ErrText> : null}
        </Card>
      ) : (
        <Card style={[{ gap: 10 }, err('what') && styles.errCard]}>
          <T v="h3">What did you notice?</T>
          <T v="caption">Tap everything that applies.</T>
          <View style={styles.grid}>
            {SYMPTOMS.map((s) => {
              const on = symptoms.includes(s.key);
              return (
                <Pressable
                  key={s.key}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  onPress={() => toggle(s.key)}
                  style={[styles.tile, on && styles.tileOn]}>
                  <Icon name={s.icon} size={20} color={on ? colors.white : colors.plum} />
                  <T v="caption" style={[styles.tileText, on && { color: colors.white }]}>
                    {s.label}
                  </T>
                </Pressable>
              );
            })}
          </View>
          {err('what') ? <ErrText>Pick at least one.</ErrText> : null}

          {symptoms.includes('vomiting') ? (
            <View style={{ gap: 8 }}>
              <T v="label">How many times did {petName} vomit?</T>
              <Segment
                options={[1, 2, 3].map((n) => ({ key: n, label: n === 3 ? '3+' : String(n) }))}
                value={vomitCount}
                onChange={(n) => {
                  setVomitCount(n);
                  setMissing((m) => m.filter((x) => x !== 'count'));
                }}
              />
              {err('count') ? <ErrText>Pick how many times.</ErrText> : null}
            </View>
          ) : null}
        </Card>
      )}

      <Card style={[{ gap: 10 }, err('when') && styles.errCard]}>
        <T v="h3">When did it start?</T>
        <Segment
          options={STARTED}
          value={started}
          onChange={(v) => {
            setStarted(v);
            setMissing((m) => m.filter((x) => x !== 'when'));
          }}
        />
        {err('when') ? <ErrText>Pick when it started.</ErrText> : null}
      </Card>

      {layout === 'tap' ? (
        <Card style={{ gap: 10 }}>
          <T v="h3">Anything else? (optional)</T>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a note"
            placeholderTextColor={colors.muted}
            multiline
            style={styles.input}
          />
        </Card>
      ) : null}

      <Button label="Save" icon="check" size="lg" onPress={save} />
    </View>
  );
}

function Segment<K extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string }[];
  value: K | null;
  onChange: (k: K) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {options.map((o) => {
        const on = value === o.key;
        return (
          <Pressable
            key={String(o.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.key)}
            style={[styles.opt, on && styles.tileOn]}>
            <T v="label" style={{ textAlign: 'center', color: on ? colors.white : colors.plum }}>
              {o.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

function ErrText({ children }: { children: string }) {
  return (
    <T v="caption" style={{ color: colors.coral, fontFamily: fonts.bodySemi }}>
      {children}
    </T>
  );
}

const styles = StyleSheet.create({
  // 16px text keeps iPhone Safari from zooming in when the field is tapped.
  input: {
    minHeight: 60,
    borderRadius: 14,
    backgroundColor: colors.lilac,
    padding: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.lilacLine,
    backgroundColor: colors.white,
  },
  tileOn: { backgroundColor: colors.violet, borderColor: colors.violet },
  tileText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 12, color: colors.plum },
  opt: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.lilacLine,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  errCard: { borderWidth: 1.5, borderColor: colors.coral },
});
