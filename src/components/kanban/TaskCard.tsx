import * as React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import type { Todo } from '@/lib/storage'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TaskCardProps = {
  task: Todo
  onDelete: (id: string) => void
  /** Render as dragging preview (overlay) — disables interactive styles. */
  asOverlay?: boolean
}

export function TaskCard({ task, onDelete, asOverlay = false }: TaskCardProps) {
  const sortable = useSortable({
    id: task.id,
    data: { type: 'task', task },
    disabled: asOverlay,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  }

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      {...(asOverlay ? {} : sortable.attributes)}
      {...(asOverlay ? {} : sortable.listeners)}
      data-testid="task-card"
      data-task-id={task.id}
    >
      <Card
        className={cn(
          'group flex items-start gap-2 px-3 py-2.5',
          asOverlay && 'shadow-xl ring-2 ring-primary/40 rotate-2',
          sortable.isDragging && !asOverlay && 'opacity-40',
        )}
      >
        {!asOverlay && (
          <button
            type="button"
            aria-label="Mover tarefa"
            {...sortable.listeners}
            className="mt-0.5 cursor-grab text-muted-foreground opacity-0 transition group-hover:opacity-100 focus:opacity-100 active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </button>
        )}
        <span className="flex-1 text-sm leading-snug break-words">
          {task.title}
        </span>
        {!asOverlay && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remover tarefa"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.id)
            }}
            className="size-7 opacity-0 transition group-hover:opacity-100 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </Card>
    </div>
  )
}
