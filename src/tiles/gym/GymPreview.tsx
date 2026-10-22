import { StyleSheet, Text } from 'react-native';

import { useQuery } from '@/db/useQuery';

import { formatDay, weekSummary } from './queries';

type Summary = { sets: number; days: number; lastDay: string | null };

export function GymPreview() {
  const { rows } = useQuery<Summary>(weekSummary);
  const s = rows[0];
  if (!s || s.sets === 0) return <Text style={styles.muted}>No sets this week</Text>;
  return (
    <>
      <Text style={styles.big}>{s.days}×</Text>
      <Text style={styles.muted}>
        this week · {s.sets} sets{s.lastDay ? `\nlast: ${formatDay(s.lastDay)}` : ''}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 28, fontWeight: '800', color: '#1C1B19' },
  muted: { fontSize: 13, color: '#24534A' },
});
