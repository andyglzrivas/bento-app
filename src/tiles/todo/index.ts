import type { TileModule } from '../types';
import { TodoPreview } from './TodoPreview';
import { TodoScreen } from './TodoScreen';

export const todoTile: TileModule = {
  id: 'todo',
  title: 'To-do',
  emoji: '✅',
  color: '#FCE7A8',
  span: 2,
  Screen: TodoScreen,
  Preview: TodoPreview,
};
