import { StyleSheet, Text } from 'react-native';

import { formatDay, useGymSets } from './store';

export function GymPreview() {
  const { week } = useGymSets();
  if (week.sets === 0) return <Text style={styles.muted}>No sets this week</Text>;
  return (
    <>
      <Text style={styles.big}>{week.days}×</Text>
      <Text style={styles.muted}>
        this week · {week.sets} sets{week.lastDay ? `\nlast: ${formatDay(week.lastDay)}` : ''}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 28, fontWeight: '800', color: '#1C1B19' },
  muted: { fontSize: 13, color: '#24534A' },
});
