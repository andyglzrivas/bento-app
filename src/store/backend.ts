import { Directory, File, Paths } from 'expo-file-system';

/**
 * Where collections live: one JSON file per collection under
 * <documents>/bento/. Expo Go ships expo-file-system (expo itself depends on
 * it), so this works without a development build.
 */
const root = new Directory(Paths.document, 'bento');

function fileFor(name: string) {
  return new File(root, `${name}.json`);
}

export function readCollection(name: string): string | null {
  const file = fileFor(name);
  return file.exists ? file.textSync() : null;
}

export async function writeCollection(name: string, json: string): Promise<void> {
  if (!root.exists) root.create({ intermediates: true });
  const file = fileFor(name);
  if (!file.exists) file.create();
  await file.write(json);
}
