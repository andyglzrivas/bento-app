# bento

A personal productivity app built from tiles. The home screen is a grid; each tile is a self-contained feature module (to-do list, gym tracker, …) with its own screen, home-grid preview, and database tables.

Expo SDK 58 · React Native 0.88 · TypeScript · Expo Router · expo-sqlite. Everything is stored on the device; there is no backend.

## Run it

Requirements: Node 22.13+ or 24.3+ and the **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)). Expo Go must support SDK 58; update it from the store if it says the project is incompatible.

```sh
git clone https://github.com/andyglzrivas/bento-app.git
cd bento-app
npm install
npx expo start
```

Scan the QR code with the Camera app (iOS) or from inside Expo Go (Android). Phone and computer must be on the same network; if they aren't (or the connection hangs), use `npx expo start --tunnel`.

Other targets:

- `npm run ios` / `npm run android`: open in a simulator or emulator, if you have Xcode or Android Studio installed.
- `npm run web`: run in the browser. SQLite runs as WebAssembly there; `metro.config.js` exists only to make that work.

Checks:

```sh
npm run typecheck
npm run lint
```

## Layout

```
src/
  app/                 Expo Router routes (every file is a screen)
    _layout.tsx        SQLiteProvider + stack navigator
    index.tsx          home grid
    tile/[id].tsx      renders a tile's full screen
  tiles/
    types.ts           TileModule contract
    registry.ts        the list of tiles shown on the home grid
    todo/              to-do module
    gym/               gym tracker module
  db/
    migrate.ts         runs each tile's migrations on startup
    useQuery.ts        SELECT hook that refreshes when a screen regains focus
  components/          shared UI (TileCard, Input, Button)
  theme.ts             light/dark colors
```

## Adding a tile

1. Create `src/tiles/<id>/index.ts` exporting a `TileModule`:

   ```ts
   import type { TileModule } from '../types';

   export const notesTile: TileModule = {
     id: 'notes', // stable; used in the URL and to track migrations
     title: 'Notes',
     emoji: '📝',
     color: '#E3D7F7',
     span: 1, // 1 = half width, 2 = full width
     migrations: [
       `CREATE TABLE notes_items (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT NOT NULL);`,
     ],
     Screen: NotesScreen,
     Preview: NotesPreview, // optional
   };
   ```

2. Add it to the array in `src/tiles/registry.ts`. Array order is grid order.

That's it: the route `/tile/notes` and the table exist on next launch.

**Migrations are append-only.** Each tile's schema version is stored in the `tile_schema` table. To change a shipped table, append a new SQL string (e.g. `ALTER TABLE …`) rather than editing an existing one, or devices that already ran the old version will never see the change. Prefix table names with the tile id so modules can't collide.

Inside a tile, use `useSQLiteContext()` from `expo-sqlite` for writes and `useQuery()` from `@/db/useQuery` for reads.

## Data

The database is `bento.db` in the app's sandbox. In Expo Go, deleting Expo Go's data (or reinstalling it) wipes it. There's no export or sync yet.
