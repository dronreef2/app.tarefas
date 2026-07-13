import * as React from 'react'
import { cn } from '@/lib/utils'
import { badgeVariants, type BadgeVariants } from './badge-variants'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, BadgeVariants {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}
