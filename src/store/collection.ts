import { useSyncExternalStore } from 'react';

import { readCollection, writeCollection } from './backend';

export type Doc = { id: string };

type Entry = { docs: Doc[]; listeners: Set<() => void>; writing: Promise<void> };

const entries = new Map<string, Entry>();

function entry(name: string): Entry {
  let e = entries.get(name);
  if (!e) {
    let docs: Doc[] = [];
    try {
      const raw = readCollection(name);
      if (raw) docs = JSON.parse(raw);
    } catch (err) {
      console.warn(`bento: could not read collection "${name}", starting empty`, err);
    }
    e = { docs, listeners: new Set(), writing: Promise.resolve() };
    entries.set(name, e);
  }
  return e;
}

function commit(name: string, docs: Doc[]) {
  const e = entry(name);
  e.docs = docs;
  e.listeners.forEach((l) => l());
  // Serialize writes so an older snapshot can never land after a newer one.
  const json = JSON.stringify(docs);
  e.writing = e.writing
    .then(() => writeCollection(name, json))
    .catch((err) => console.warn(`bento: failed to save collection "${name}"`, err));
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * A persisted list of documents. Every component using the same collection
 * name shares one in-memory copy, so a tile's screen and its home-grid
 * preview stay in sync without refetching.
 */
export function useCollection<T extends Doc>(name: string) {
  const docs = useSyncExternalStore(
    (listener) => {
      const e = entry(name);
      e.listeners.add(listener);
      return () => e.listeners.delete(listener);
    },
    () => entry(name).docs,
  ) as T[];

  return {
    docs,
    add(doc: Omit<T, 'id'>) {
      commit(name, [...entry(name).docs, { ...doc, id: newId() } as T]);
    },
    update(id: string, patch: Partial<Omit<T, 'id'>>) {
      commit(
        name,
        entry(name).docs.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      );
    },
    remove(id: string) {
      commit(
        name,
        entry(name).docs.filter((d) => d.id !== id),
      );
    },
  };
}
