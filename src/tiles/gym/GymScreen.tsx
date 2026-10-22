import { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { Button, Input } from '@/components/ui';
import { useTheme } from '@/theme';

import { formatDay, useGymSets } from './store';

export function GymScreen() {
  const theme = useTheme();
  const gym = useGymSets();

  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const w = Number(weight.replace(',', '.'));
  const r = Number.parseInt(reps, 10);
  const valid = exercise.trim() !== '' && weight !== '' && Number.isFinite(w) && w >= 0 && r > 0;

  function logSet() {
    if (!valid) return;
    gym.add({ exercise: exercise.trim(), weight: w, reps: r, performedAt: Date.now() });
    // Keep exercise and weight filled: the next set is usually the same lift.
    setReps('');
  }

  const sections = useMemo(
    () => gym.days.map(({ day, data }) => ({ title: formatDay(day), data })),
    [gym.days],
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(s) => s.id}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        <View style={styles.form}>
          <Input
            value={exercise}
            onChangeText={setExercise}
            placeholder="Exercise"
            autoCapitalize="words"
          />
          {gym.recentExercises.length > 0 ? (
            <View style={styles.chips}>
              {gym.recentExercises.map((name) => (
                <Pressable
                  key={name}
                  onPress={() => setExercise(name)}
                  style={[
                    styles.chip,
                    {
                      borderColor: theme.border,
                      backgroundColor: name === exercise ? theme.accent : theme.surface,
                    },
                  ]}
                >
                  <Text style={{ color: name === exercise ? '#FFFFFF' : theme.text }}>{name}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <View style={styles.inline}>
            <Input
              value={weight}
              onChangeText={setWeight}
              placeholder="Weight"
              keyboardType="decimal-pad"
            />
            <Input
              value={reps}
              onChangeText={setReps}
              placeholder="Reps"
              keyboardType="number-pad"
            />
            <Button label="Log" onPress={logSet} disabled={!valid} />
          </View>
        </View>
      }
      ListEmptyComponent={
        <Text style={[styles.empty, { color: theme.muted }]}>No sets logged yet.</Text>
      }
      renderSectionHeader={({ section }) => (
        <Text style={[styles.sectionHeader, { color: theme.muted }]}>{section.title}</Text>
      )}
      renderItem={({ item }) => (
        <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.exercise, { color: theme.text }]} numberOfLines={1}>
            {item.exercise}
          </Text>
          <Text style={{ color: theme.text, fontVariant: ['tabular-nums'] }}>
            {item.weight} × {item.reps}
          </Text>
          <Pressable
            onPress={() => gym.remove(item.id)}
            hitSlop={12}
            accessibilityLabel="Delete set"
          >
            <Text style={{ color: theme.danger, fontSize: 16 }}>✕</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 32, gap: 8 },
  form: { gap: 10, marginBottom: 8 },
  inline: { flexDirection: 'row', gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionHeader: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginTop: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  exercise: { flex: 1, fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
});
