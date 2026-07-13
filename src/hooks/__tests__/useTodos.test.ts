import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useTodos } from '@/hooks/useTodos'

describe('useTodos', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('starts empty', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toEqual([])
    expect(result.current.counts).toEqual({
      todo: 0,
      doing: 0,
      done: 0,
      total: 0,
    })
  })

  it('add appends to the requested column', () => {
    const { result } = renderHook(() => useTodos())

    act(() => result.current.add('Buy milk', 'todo'))
    act(() => result.current.add('Walk dog', 'doing'))

    expect(result.current.todos).toHaveLength(2)
    expect(result.current.grouped.todo).toHaveLength(1)
    expect(result.current.grouped.doing).toHaveLength(1)
    expect(result.current.counts.total).toBe(2)
  })

  it('add trims whitespace and ignores empty', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.add('   ', 'todo'))
    expect(result.current.todos).toHaveLength(0)
  })

  it('remove deletes by id', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.add('A', 'todo'))
    act(() => result.current.add('B', 'todo'))
    const idB = result.current.todos[1].id

    act(() => result.current.remove(idB))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].title).toBe('A')
  })

  it('move changes status and reorders', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.add('A', 'todo'))
    act(() => result.current.add('B', 'todo'))
    const idA = result.current.todos[0].id

    act(() => result.current.move(idA, 'doing', null, null))

    expect(result.current.grouped.todo).toHaveLength(1)
    expect(result.current.grouped.doing).toHaveLength(1)
    expect(result.current.grouped.doing[0].title).toBe('A')
  })

  it('clearDone removes only done items', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.add('A', 'done'))
    act(() => result.current.add('B', 'todo'))
    act(() => result.current.clearDone())
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].title).toBe('B')
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.add('Persisted', 'todo'))

    const raw = localStorage.getItem('todo-app:items:v2')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].title).toBe('Persisted')
  })
})
