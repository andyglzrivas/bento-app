import type { ComponentType } from 'react';

/**
 * A tile is a self-contained feature module. Register it in `registry.ts`
 * and it shows up on the home grid with its own screen. Tiles persist data with
 * `useCollection` from `@/store/collection`, naming collections `<tile id>.<thing>`.
 */
export type TileModule = {
  /** Stable, URL-safe id. Used in routes and collection names; never rename. */
  id: string;
  title: string;
  emoji: string;
  /** Tile background color on the home grid. */
  color: string;
  /** Grid width: 1 = half row, 2 = full row. Defaults to 1. */
  span?: 1 | 2;
  /** Full-screen view opened when the tile is tapped. */
  Screen: ComponentType;
  /** Optional live summary rendered inside the tile on the home grid. */
  Preview?: ComponentType;
};
