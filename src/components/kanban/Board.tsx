import * as React from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Status, Todo } from '@/lib/storage'
import { Column } from './Column'
import { TaskCard } from './TaskCard'
import { Button } from '@/components/ui/button'
import { NewTaskDialog } from './NewTaskDialog'
import { cn } from '@/lib/utils'

const COLUMNS: { status: Status; title: string }[] = [
  { status: 'todo', title: 'A Fazer' },
  { status: 'doing', title: 'Em Andamento' },
  { status: 'done', title: 'Concluídas' },
]

type BoardProps = {
  grouped: Record<Status, Todo[]>
  counts: { todo: number; doing: number; done: number; total: number }
  onAdd: (title: string) => void
  onDelete: (id: string) => void
  onMove: (
    id: string,
    toStatus: Status,
    before: string | null,
    after: string | null,
  ) => void
  onClearDone: () => void
}

/**
 * Resolve which Status a given droppable id belongs to.
 * Droppable ids can be either a column (`column-todo`) or a task card
 * (`task_<id>` style), and we need to figure out the parent column.
 */
function columnForOver(
  over: { id: string | number } | null,
  grouped: Record<Status, Todo[]>,
): Status | null {
  if (!over) return null
  const id = String(over.id)
  if (id.startsWith('column-')) {
    const s = id.replace('column-', '') as Status
    if (['todo', 'doing', 'done'].includes(s)) return s
  }
  // It's a task id — find which column it belongs to.
  for (const status of ['todo', 'doing', 'done'] as const) {
    if (grouped[status].some((t) => t.id === id)) return status
  }
  return null
}

export function Board({
  grouped,
  counts,
  onAdd,
  onDelete,
  onMove,
  onClearDone,
}: BoardProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const activeTask = activeId
    ? (['todo', 'doing', 'done'] as const)
        .flatMap((s) => grouped[s])
        .find((t) => t.id === activeId)
    : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id))
  }

  function handleDragOver(_e: DragOverEvent) {
    // No-op for now: we only commit on dragEnd. Re-enable here if you
    // want live column reordering while dragging (more complex, but
    // Linear-style smooth).
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null)
    const { active, over } = e
    if (!over) return

    const activeIdStr = String(active.id)
    const overColumn = columnForOver(over, grouped)
    if (!overColumn) return

    // Figure out the neighbours under the drop target:
    // if hovering a task, the gap is between its predecessors; if hovering a column,
    // drop at the bottom (or top, see below).
    const colItems = grouped[overColumn]
    const overIdStr = String(over.id)

    let before: string | null = null
    let after: string | null = null

    if (overIdStr.startsWith('column-')) {
      // Drop on empty column area.
      // Find the "last" item to position after it, or insert at top.
      const last = colItems[colItems.length - 1]
      if (last && last.id !== activeIdStr) {
        after = last.position
      } else if (colItems.length === 0) {
        // empty column — no neighbours
      } else {
        // dragging within same column onto its own area, no change needed
        const current = colItems.find((t) => t.id === activeIdStr)
        if (current && current.status === overColumn) return
      }
    } else {
      // Hovering another card — find its index.
      const overIndex = colItems.findIndex((t) => t.id === overIdStr)
      if (overIndex === -1) return
      // The item being moved inserts at overIndex.
      const next = colItems[overIndex + 1]
      const prev = overIndex > 0 ? colItems[overIndex - 1] : null
      after = prev?.position ?? null
      before = next?.position ?? null
      // If we're hovering our own position, no-op.
      if (
        colItems[overIndex]?.id === activeIdStr &&
        colItems[overIndex]?.status === overColumn
      ) {
        return
      }
      // If "next" is the item being dragged, skip it.
      if (next?.id === activeIdStr) {
        const beyond = colItems[overIndex + 2]
        before = beyond?.position ?? null
      }
    }

    onMove(activeIdStr, overColumn, before, after)
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Tarefas</h1>
          <span
            className="text-sm text-muted-foreground"
            data-testid="counter-total"
          >
            {counts.total === 0
              ? 'nenhuma tarefa'
              : `${counts.total} ${counts.total === 1 ? 'tarefa' : 'tarefas'}`}
            {counts.done > 0 && ` · ${counts.done} concluídas`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearDone}
            disabled={counts.done === 0}
            data-testid="clear-done"
          >
            Limpar concluídas ({counts.done})
          </Button>
          <NewTaskDialog onCreate={onAdd} />
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div
          className={cn(
            'grid flex-1 grid-cols-1 gap-4',
            'md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {COLUMNS.map((c) => (
            <Column
              key={c.status}
              status={c.status}
              title={c.title}
              tasks={grouped[c.status]}
              onDelete={onDelete}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} onDelete={() => {}} asOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
