import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes intelligently.
 * - `clsx` handles conditional classes (arrays, objects, falsy values)
 * - `twMerge` resolves Tailwind conflicts (e.g. `p-2 p-4` → `p-4`)
 *
 * @example
 * cn('p-2', condition && 'p-4', 'text-slate-900')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
