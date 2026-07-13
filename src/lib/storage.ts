/**
 * Persisted Todo shape — stored in localStorage as plain JSON.
 * `position` is a fractional-indexing key (string) so we can
 * insert/reorder without rewriting neighbours.
 */
export type Status = 'todo' | 'doing' | 'done'

export type Todo = {
  id: string
  title: string
  status: Status
  position: string
  createdAt: number
}

const STORAGE_KEY = 'todo-app:items:v2'

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is Todo =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Todo).id === 'string' &&
        typeof (item as Todo).title === 'string' &&
        typeof (item as Todo).position === 'string' &&
        typeof (item as Todo).createdAt === 'number' &&
        ['todo', 'doing', 'done'].includes((item as Todo).status),
    )
  } catch {
    return []
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // quota exceeded, private mode, etc. — silently skip
  }
}

export function generateId(): string {
  // ULID-ish: timestamp + random suffix. Sortable + collision-safe for client use.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}
