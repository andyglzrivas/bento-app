import type { TileModule } from '../types';
import { GymPreview } from './GymPreview';
import { GymScreen } from './GymScreen';

export const gymTile: TileModule = {
  id: 'gym',
  title: 'Gym',
  emoji: '🏋️',
  color: '#C9E4DE',
  Screen: GymScreen,
  Preview: GymPreview,
};
