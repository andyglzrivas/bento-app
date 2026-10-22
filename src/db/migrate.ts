import type { SQLiteDatabase } from 'expo-sqlite';

import { tiles } from '@/tiles/registry';

/**
 * Runs pending migrations for every registered tile. Versions are tracked per
 * tile, so modules can be added, removed, or upgraded independently.
 */
export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS tile_schema (
      tile_id TEXT PRIMARY KEY NOT NULL,
      version INTEGER NOT NULL
    );
  `);

  for (const tile of tiles) {
    const row = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM tile_schema WHERE tile_id = ?',
      tile.id,
    );
    const current = row?.version ?? 0;
    if (current >= tile.migrations.length) continue;

    // onInit runs before any screen can query, so the non-exclusive transaction
    // is safe here (and withExclusiveTransactionAsync is unsupported on web).
    await db.withTransactionAsync(async () => {
      for (let v = current; v < tile.migrations.length; v++) {
        await db.execAsync(tile.migrations[v]);
      }
      await db.runAsync(
        'INSERT INTO tile_schema (tile_id, version) VALUES (?, ?) ON CONFLICT(tile_id) DO UPDATE SET version = excluded.version',
        tile.id,
        tile.migrations.length,
      );
    });
  }
}
