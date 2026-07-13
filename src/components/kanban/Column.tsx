import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Status, Todo } from '@/lib/storage'
import { TaskCard } from './TaskCard'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type ColumnProps = {
  status: Status
  title: string
  tasks: Todo[]
  onDelete: (id: string) => void
}

const STATUS_LABELS: Record<Status, string> = {
  todo: 'A Fazer',
  doing: 'Em Andamento',
  done: 'Concluídas',
}

const STATUS_VARIANT: Record<Status, 'todo' | 'doing' | 'done'> = {
  todo: 'todo',
  doing: 'doing',
  done: 'done',
}

export function Column({ status, title, tasks, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { type: 'column', status },
  })

  return (
    <div
      className="flex h-full min-h-120 w-full flex-col gap-3 rounded-xl bg-muted/40 p-3"
      data-testid={`column-${status}`}
    >
      <header className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold tracking-tight">
          {STATUS_LABELS[status] ?? title}
        </h2>
        <Badge variant={STATUS_VARIANT[status]} data-testid={`count-${status}`}>
          {tasks.length}
        </Badge>
      </header>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-1 flex-col gap-2 rounded-lg p-1 transition-colors',
          isOver && 'bg-primary/5 ring-2 ring-primary/20',
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div
            className={cn(
              'flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground',
              isOver && 'border-primary/40',
            )}
          >
            {status === 'done'
              ? 'Arraste aqui para concluir'
              : status === 'doing'
                ? 'Em progresso'
                : 'Arraste tarefas para cá'}
          </div>
        )}
      </div>
    </div>
  )
}
