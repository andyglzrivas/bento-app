/** Web preview only (`npm run web`): collections are kept in localStorage. */

const key = (name: string) => `bento:${name}`;

export function readCollection(name: string): string | null {
  try {
    return localStorage.getItem(key(name));
  } catch {
    return null;
  }
}

export async function writeCollection(name: string, json: string): Promise<void> {
  localStorage.setItem(key(name), json);
}
