/**
 * Stable ordering using fractional indexing (Linear/Figma style).
 *
 * Each item has a string `position`; dragging between siblings produces a new
 * lexicographically-ordered string without rewriting any unrelated item.
 *
 * Based on Figma's public spec: https://observablehq.com/@dgreensp/implementing-fractional-indexing
 * The `fractional-indexing` package implements the original algorithm.
 */
import { generateKeyBetween, generateNKeysBetween } from 'fractional-indexing'

/**
 * Position for a new item at the start of an empty (or new) list.
 */
export function firstPosition(): string {
  return generateKeyBetween(null, null) ?? 'a0'
}

/**
 * Position for a new item appended after the last one.
 */
export function appendAfter(after: string | null | undefined): string {
  return generateKeyBetween(after, null) ?? 'a0'
}

/**
 * Reorder: get a new position between two neighbours.
 *
 * @param before  Position of the item above the gap, or null if at the top.
 * @param after   Position of the item below the gap, or null if at the bottom.
 *
 * @example
 *   moveBefore('a0', 'a1', 'a2')  // 'a05'
 *   moveBefore('a1', 'a2', null)  // 'a15'  (after 'a1', before 'a2')
 */
export function moveBefore(
  before: string | null | undefined,
  after: string | null | undefined,
): string {
  return generateKeyBetween(before, after) ?? 'a0'
}

/**
 * For a reorder spanning N items into one position: produce N evenly-distributed keys.
 * (Useful if you ever batch-insert.)
 */
export function fillGap(
  before: string | null | undefined,
  after: string | null | undefined,
  n: number,
): string[] {
  return generateNKeysBetween(before, after, n)
}
