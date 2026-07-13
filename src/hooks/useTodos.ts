import { useCallback, useEffect, useMemo } from 'react'
import type { Status, Todo } from '@/lib/storage'
import { generateId, loadTodos, saveTodos } from '@/lib/storage'
import { appendAfter, firstPosition, moveBefore } from '@/lib/order'
import { useState } from 'react'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const add = useCallback((title: string, status: Status = 'todo') => {
    const trimmed = title.trim()
    if (!trimmed) return
    setTodos((prev) => {
      const lastInCol = [...prev].reverse().find((t) => t.status === status)
      const position = lastInCol
        ? appendAfter(lastInCol.position)
        : firstPosition()
      return [
        ...prev,
        {
          id: generateId(),
          title: trimmed,
          status,
          position,
          createdAt: Date.now(),
        },
      ]
    })
  }, [])

  const remove = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearDone = useCallback(() => {
    setTodos((prev) => prev.filter((t) => t.status !== 'done'))
  }, [])

  /**
   * Move an item (within or across columns) to a new column + position.
   *
   * Uses fractional indexing to compute a position between the visible
   * neighbours without renumbering anything else.
   *
   * @param id          The dragged item id.
   * @param toStatus    The destination column.
   * @param before      Position of the item we want to be *after* (null = top of list).
   *                    (We name it `before` to match dnd-kit's convention where
   *                    you pass the position *above* the drop slot.)
   * @param after       Position of the item we want to be *before* (null = bottom).
   */
  const move = useCallback(
    (
      id: string,
      toStatus: Status,
      before: string | null,
      after: string | null,
    ) => {
      setTodos((prev) => {
        const target = prev.find((t) => t.id === id)
        if (!target) return prev
        // Same position means no-op (don't churn), but still allow status change.
        const newPosition =
          before === target.position || after === target.position
            ? target.position
            : moveBefore(before, after)
        return prev.map((t) =>
          t.id === id ? { ...t, status: toStatus, position: newPosition } : t,
        )
      })
    },
    [],
  )

  /** Group todos by status, sorted by `position`. */
  const grouped = useMemo(() => {
    const cols: Record<Status, Todo[]> = { todo: [], doing: [], done: [] }
    for (const t of todos) cols[t.status].push(t)
    for (const s of ['todo', 'doing', 'done'] as const) {
      cols[s].sort((a, b) => (a.position < b.position ? -1 : 1))
    }
    return cols
  }, [todos])

  const counts = useMemo(
    () => ({
      todo: grouped.todo.length,
      doing: grouped.doing.length,
      done: grouped.done.length,
      total: todos.length,
    }),
    [grouped, todos.length],
  )

  return { todos, grouped, counts, add, remove, move, clearDone }
}
