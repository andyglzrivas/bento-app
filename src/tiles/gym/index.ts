import type { TileModule } from '../types';
import { GymPreview } from './GymPreview';
import { GymScreen } from './GymScreen';

export const gymTile: TileModule = {
  id: 'gym',
  title: 'Gym',
  emoji: '🏋️',
  color: '#C9E4DE',
  migrations: [
    `CREATE TABLE gym_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise TEXT NOT NULL,
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      performed_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX gym_sets_performed_at ON gym_sets (performed_at);`,
  ],
  Screen: GymScreen,
  Preview: GymPreview,
};
