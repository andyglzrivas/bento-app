export type TodoItem = { id: number; title: string; done: 0 | 1 };

export const listTodos =
  'SELECT id, title, done FROM todo_items ORDER BY done, created_at DESC, id DESC';
export const listOpenTodos =
  'SELECT id, title, done FROM todo_items WHERE done = 0 ORDER BY created_at DESC, id DESC';
