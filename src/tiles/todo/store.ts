import { useMemo } from 'react';

import { useCollection } from '@/store/collection';

export type TodoItem = { id: string; title: string; done: boolean; createdAt: number };

/** Open items first, newest first within each group. */
export function useTodos() {
  const todos = useCollection<TodoItem>('todo.items');
  const sorted = useMemo(
    () =>
      [...todos.docs].sort((a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt),
    [todos.docs],
  );
  return { ...todos, sorted, open: sorted.filter((t) => !t.done) };
}
