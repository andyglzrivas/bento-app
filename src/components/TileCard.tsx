import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TileModule } from '@/tiles/types';

export function TileCard({ tile }: { tile: TileModule }) {
  const router = useRouter();
  const { Preview } = tile;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/tile/[id]', params: { id: tile.id } })}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: tile.color, opacity: pressed ? 0.85 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={tile.title}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{tile.emoji}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {tile.title}
        </Text>
      </View>
      {Preview ? (
        <View style={styles.preview}>
          <Preview />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: { gap: 6 },
  emoji: { fontSize: 28 },
  title: { fontSize: 18, fontWeight: '700', color: '#1C1B19' },
  preview: { marginTop: 12 },
});
