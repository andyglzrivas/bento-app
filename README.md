# bento

A personal productivity app built from tiles. The home screen is a grid; each tile is a self-contained feature module (to-do list, gym tracker, …) with its own screen, home-grid preview, and database tables.

Expo SDK 58 · React Native 0.88 · TypeScript · Expo Router. Everything is stored on the device as JSON files (expo-file-system); there is no backend. Every dependency ships in Expo Go, so no development build is needed.

## Run it

Requirements: Node 22.13+ or 24.3+ and the **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)). Expo Go must support SDK 58. App-store builds can lag behind a new SDK; if Expo Go says the project is incompatible, install the current build from https://expo.dev/go.

```sh
git clone https://github.com/andyglzrivas/bento-app.git
cd bento-app
npm install
npx expo start
```

Scan the QR code with the Camera app (iOS) or from inside Expo Go (Android). Phone and computer must be on the same network; if they aren't (or the connection hangs), use `npx expo start --tunnel` (requires `npx expo login` first).

Other targets:

- `npm run ios` / `npm run android`: open in a simulator or emulator, if you have Xcode or Android Studio installed.
- `npm run web`: run in the browser (data goes to localStorage there).

Checks:

```sh
npm run typecheck
npm run lint
```

## Layout

```
src/
  app/                 Expo Router routes (every file is a screen)
    _layout.tsx        stack navigator
    index.tsx          home grid
    tile/[id].tsx      renders a tile's full screen
  tiles/
    types.ts           TileModule contract
    registry.ts        the list of tiles shown on the home grid
    todo/              to-do module
    gym/               gym tracker module
  store/
    collection.ts      useCollection(): persisted list of docs, shared across components
    backend.ts         native storage: one JSON file per collection
    backend.web.ts     web storage: localStorage
  components/          shared UI (TileCard, Input, Button)
  theme.ts             light/dark colors
```

## Adding a tile

1. Create `src/tiles/<id>/index.ts` exporting a `TileModule`:

   ```ts
   import type { TileModule } from '../types';

   export const notesTile: TileModule = {
     id: 'notes', // stable; used in the URL and collection names
     title: 'Notes',
     emoji: '📝',
     color: '#E3D7F7',
     span: 1, // 1 = half width, 2 = full width
     Screen: NotesScreen,
     Preview: NotesPreview, // optional
   };
   ```

2. Add it to the array in `src/tiles/registry.ts`. Array order is grid order.

That's it: the route `/tile/notes` exists on next launch.

Inside a tile, persist data with `useCollection`:

```ts
import { useCollection } from '@/store/collection';

type Note = { id: string; body: string };
const notes = useCollection<Note>('notes.items'); // prefix with the tile id
notes.add({ body: 'hi' });          // id is generated
notes.update(id, { body: 'edited' });
notes.remove(id);
notes.docs;                         // current list; re-renders on change
```

Every component using the same collection name shares one in-memory copy, so a tile's screen and its home-grid preview update together. Records are plain JSON: when you add a field later, treat it as optional when reading old records.

## Data

Data lives in `<app documents>/bento/<collection>.json`. In Expo Go, clearing Expo Go's data (or reinstalling it) wipes it. There's no export or sync yet.

Why not SQLite: Expo Go 58.0.5 on Android does not ship the `ExpoSQLite` native module, so `expo-sqlite` crashes on launch there. If the app later moves to a development build, swapping `src/store/backend.ts` for SQLite is a contained change.
