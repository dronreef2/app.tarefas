import { Board } from '@/components/kanban/Board'
import { useTodos } from '@/hooks/useTodos'

/**
 * App root — wires state (via useTodos) to the Kanban Board.
 *
 * Layering:
 *  • `storage.ts`     → schema + persistence (localStorage)
 *  • `order.ts`       → fractional-indexing helpers
 *  • `useTodos.ts`    → state + actions (lives in /hooks)
 *  • `Board`          → presentational + DnD orchestration
 *  • `Column/TaskCard`→ visual primitives
 */
export function TodoApp() {
  const { grouped, counts, add, remove, move, clearDone } = useTodos()

  return (
    <main className="mx-auto flex h-full min-h-dvh w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8">
      <Board
        grouped={grouped}
        counts={counts}
        onAdd={(title) => add(title)}
        onDelete={remove}
        onMove={move}
        onClearDone={clearDone}
      />
      <footer className="mt-6 text-center text-xs text-muted-foreground">
        Salvo localmente neste navegador. Drag-and-drop com dnd-kit, ordem
        estável via fractional-indexing.
      </footer>
    </main>
  )
}
