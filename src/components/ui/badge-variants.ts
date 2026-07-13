import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Visual variants for the Badge component.
 * Extracted to a separate file so that `badge.tsx` exports only the
 * component itself — which keeps React Fast Refresh happy.
 */
export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
        todo: 'border-transparent bg-[var(--status-todo)]/15 text-[var(--status-todo)]',
        doing:
          'border-transparent bg-[var(--status-doing)]/15 text-[var(--status-doing)]',
        done: 'border-transparent bg-[var(--status-done)]/15 text-[var(--status-done)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
