import { useSQLiteContext } from 'expo-sqlite';
import { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { Button, Input } from '@/components/ui';
import { useQuery } from '@/db/useQuery';
import { useTheme } from '@/theme';

import { formatDay, recentExercises, recentSets, type GymSet } from './queries';

export function GymScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const sets = useQuery<GymSet>(recentSets);
  const exercises = useQuery<{ exercise: string }>(recentExercises);

  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const w = Number(weight.replace(',', '.'));
  const r = Number.parseInt(reps, 10);
  const valid = exercise.trim() !== '' && weight !== '' && Number.isFinite(w) && w >= 0 && r > 0;

  async function logSet() {
    if (!valid) return;
    await db.runAsync(
      'INSERT INTO gym_sets (exercise, weight, reps) VALUES (?, ?, ?)',
      exercise.trim(),
      w,
      r,
    );
    // Keep exercise and weight filled: the next set is usually the same lift.
    setReps('');
    sets.reload();
    exercises.reload();
  }

  async function remove(id: number) {
    await db.runAsync('DELETE FROM gym_sets WHERE id = ?', id);
    sets.reload();
    exercises.reload();
  }

  const sections = useMemo(() => {
    const byDay = new Map<string, GymSet[]>();
    for (const s of sets.rows) {
      const list = byDay.get(s.day) ?? [];
      list.push(s);
      byDay.set(s.day, list);
    }
    return [...byDay].map(([day, data]) => ({ title: formatDay(day), data }));
  }, [sets.rows]);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(s) => String(s.id)}
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
          {exercises.rows.length > 0 ? (
            <View style={styles.chips}>
              {exercises.rows.map(({ exercise: name }) => (
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
          <Pressable onPress={() => remove(item.id)} hitSlop={12} accessibilityLabel="Delete set">
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
