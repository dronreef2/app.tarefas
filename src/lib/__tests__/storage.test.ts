import { afterEach, describe, expect, it } from 'vitest'
import { generateId, loadTodos, saveTodos, type Todo } from '@/lib/storage'

describe('storage (localStorage)', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('returns [] when storage is empty', () => {
    expect(loadTodos()).toEqual([])
  })

  it('round-trips todos through saveTodos/loadTodos', () => {
    const items: Todo[] = [
      {
        id: '1',
        title: 'A',
        status: 'todo',
        position: 'a0',
        createdAt: 1,
      },
      {
        id: '2',
        title: 'B',
        status: 'doing',
        position: 'a1',
        createdAt: 2,
      },
    ]
    saveTodos(items)
    expect(loadTodos()).toEqual(items)
  })

  it('filters out malformed entries', () => {
    localStorage.setItem(
      'todo-app:items:v2',
      JSON.stringify([
        { id: '1', title: 'ok', status: 'todo', position: 'a0', createdAt: 1 },
        {
          id: '2',
          title: 'bad status',
          status: 'invalid',
          position: 'a1',
          createdAt: 1,
        },
        { id: '3', title: 'missing pos', status: 'todo', createdAt: 1 },
        'not an object',
      ]),
    )
    expect(loadTodos()).toHaveLength(1)
  })

  it('generateId produces unique strings', () => {
    const a = new Set<string>()
    for (let i = 0; i < 50; i++) a.add(generateId())
    expect(a.size).toBe(50)
  })
})
