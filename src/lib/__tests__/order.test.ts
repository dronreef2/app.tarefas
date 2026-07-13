import { describe, expect, it } from 'vitest'
import { appendAfter, firstPosition, moveBefore } from '@/lib/order'

describe('order (fractional indexing)', () => {
  it('firstPosition returns a valid key', () => {
    const p = firstPosition()
    expect(typeof p).toBe('string')
    expect(p.length).toBeGreaterThan(0)
  })

  it('appendAfter returns a key greater than the input', () => {
    const a = firstPosition()
    const b = appendAfter(a)
    expect(b > a).toBe(true)
  })

  it('moveBefore produces a key strictly between two neighbours', () => {
    const a = firstPosition()
    const c = appendAfter(a)
    const b = moveBefore(a, c)
    expect(a < b).toBe(true)
    expect(b < c).toBe(true)
  })

  it('moveBefore supports inserting at the start (after=null)', () => {
    const a = firstPosition()
    const b = moveBefore(null, a)
    expect(b < a).toBe(true)
  })

  it('moveBefore supports appending (before=null)', () => {
    const a = firstPosition()
    const b = moveBefore(a, null)
    expect(b > a).toBe(true)
  })
})
