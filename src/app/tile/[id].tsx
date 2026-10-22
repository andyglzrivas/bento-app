import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { getTile } from '@/tiles/registry';
import { useTheme } from '@/theme';

export default function TileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tile = getTile(id);
  const theme = useTheme();

  if (!tile) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={{ color: theme.muted }}>No tile named “{id}”.</Text>
      </View>
    );
  }

  const { Screen } = tile;
  return (
    <>
      <Stack.Screen options={{ title: `${tile.emoji} ${tile.title}` }} />
      <Screen />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
