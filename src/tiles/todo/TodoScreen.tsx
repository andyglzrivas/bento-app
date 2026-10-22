import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Input } from '@/components/ui';
import { useQuery } from '@/db/useQuery';
import { useTheme } from '@/theme';

import { listTodos, type TodoItem } from './queries';

export function TodoScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const { rows, reload } = useQuery<TodoItem>(listTodos);
  const [draft, setDraft] = useState('');

  async function add() {
    const title = draft.trim();
    if (!title) return;
    await db.runAsync('INSERT INTO todo_items (title) VALUES (?)', title);
    setDraft('');
    reload();
  }

  async function toggle(item: TodoItem) {
    await db.runAsync('UPDATE todo_items SET done = ? WHERE id = ?', item.done ? 0 : 1, item.id);
    reload();
  }

  async function remove(item: TodoItem) {
    await db.runAsync('DELETE FROM todo_items WHERE id = ?', item.id);
    reload();
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
        data={rows}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>Nothing to do.</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable
              onPress={() => toggle(item)}
              style={styles.rowMain}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: !!item.done }}
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
              onPress={() => remove(item)}
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
