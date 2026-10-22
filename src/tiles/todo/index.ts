import type { TileModule } from '../types';
import { TodoPreview } from './TodoPreview';
import { TodoScreen } from './TodoScreen';

export const todoTile: TileModule = {
  id: 'todo',
  title: 'To-do',
  emoji: '✅',
  color: '#FCE7A8',
  span: 2,
  migrations: [
    `CREATE TABLE todo_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );`,
  ],
  Screen: TodoScreen,
  Preview: TodoPreview,
};
