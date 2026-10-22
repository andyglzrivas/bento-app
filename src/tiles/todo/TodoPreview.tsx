import { StyleSheet, Text } from 'react-native';

import { useQuery } from '@/db/useQuery';

import { listOpenTodos, type TodoItem } from './queries';

export function TodoPreview() {
  const { rows } = useQuery<TodoItem>(listOpenTodos);
  if (rows.length === 0) return <Text style={styles.muted}>All clear</Text>;
  return (
    <>
      <Text style={styles.count}>{rows.length} open</Text>
      {rows.slice(0, 3).map((t) => (
        <Text key={t.id} style={styles.item} numberOfLines={1}>
          • {t.title}
        </Text>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  count: { fontSize: 13, fontWeight: '600', color: '#5C4A12', marginBottom: 4 },
  item: { fontSize: 15, color: '#1C1B19' },
  muted: { fontSize: 15, color: '#5C4A12' },
});
