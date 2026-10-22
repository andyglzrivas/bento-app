import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Input } from '@/components/ui';
import { useTheme } from '@/theme';

import { useTodos } from './store';

export function TodoScreen() {
  const theme = useTheme();
  const todos = useTodos();
  const [draft, setDraft] = useState('');

  function add() {
    const title = draft.trim();
    if (!title) return;
    todos.add({ title, done: false, createdAt: Date.now() });
    setDraft('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.composer}>
        <Input
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a task"
          returnKeyType="done"
          onSubmitEditing={add}
          submitBehavior="submit"
        />
        <Button label="Add" onPress={add} disabled={!draft.trim()} />
      </View>
      <FlatList
        data={todos.sorted}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>Nothing to do.</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable
              onPress={() => todos.update(item.id, { done: !item.done })}
              style={styles.rowMain}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.done }}
            >
              <Text style={styles.check}>{item.done ? '☑' : '☐'}</Text>
              <Text
                style={[
                  styles.title,
                  { color: item.done ? theme.muted : theme.text },
                  item.done ? styles.done : null,
                ]}
              >
                {item.title}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => todos.remove(item.id)}
              hitSlop={12}
              accessibilityLabel={`Delete ${item.title}`}
            >
              <Text style={{ color: theme.danger, fontSize: 18 }}>✕</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  composer: { flexDirection: 'row', gap: 8, padding: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  check: { fontSize: 20 },
  title: { fontSize: 16, flexShrink: 1 },
  done: { textDecorationLine: 'line-through' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
});
