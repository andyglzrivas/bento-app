import { ScrollView, StyleSheet, View } from 'react-native';

import { TileCard } from '@/components/TileCard';
import { tiles } from '@/tiles/registry';
import type { TileModule } from '@/tiles/types';

/** Packs tiles into rows of width 2. A span-2 tile always gets its own row. */
function toRows(list: TileModule[]): TileModule[][] {
  const rows: TileModule[][] = [];
  let row: TileModule[] = [];
  let width = 0;
  for (const tile of list) {
    const span = tile.span ?? 1;
    if (width + span > 2) {
      rows.push(row);
      row = [];
      width = 0;
    }
    row.push(tile);
    width += span;
  }
  if (row.length) rows.push(row);
  return rows;
}

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.grid} contentInsetAdjustmentBehavior="automatic">
      {toRows(tiles).map((row) => (
        <View key={row.map((t) => t.id).join('|')} style={styles.row}>
          {row.map((tile) => (
            <View key={tile.id} style={{ flex: tile.span ?? 1 }}>
              <TileCard tile={tile} />
            </View>
          ))}
          {row.length === 1 && (row[0].span ?? 1) === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
});
