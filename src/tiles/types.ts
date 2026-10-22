import type { ComponentType } from 'react';

/**
 * A tile is a self-contained feature module. Register it in `registry.ts`
 * and it shows up on the home grid with its own screen and database tables.
 */
export type TileModule = {
  /** Stable, URL-safe id. Used in routes and to track migrations; never rename. */
  id: string;
  title: string;
  emoji: string;
  /** Tile background color on the home grid. */
  color: string;
  /** Grid width: 1 = half row, 2 = full row. Defaults to 1. */
  span?: 1 | 2;
  /**
   * Ordered SQL migrations for this tile's tables. Entry N upgrades the
   * tile's schema from version N to N + 1. Only append; never edit a shipped entry.
   */
  migrations: string[];
  /** Full-screen view opened when the tile is tapped. */
  Screen: ComponentType;
  /** Optional live summary rendered inside the tile on the home grid. */
  Preview?: ComponentType;
};
