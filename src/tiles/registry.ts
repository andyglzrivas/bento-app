import { gymTile } from './gym';
import type { TileModule } from './types';
import { todoTile } from './todo';

/** Home grid order. Add a tile by importing its module and appending it here. */
export const tiles: TileModule[] = [todoTile, gymTile];

export function getTile(id: string): TileModule | undefined {
  return tiles.find((t) => t.id === id);
}
