import { useEffect, useMemo, useRef, useState } from 'react'

type Todo = {
  id: number
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'todo-app:items'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is Todo =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Todo).id === 'number' &&
        typeof (item as Todo).text === 'string' &&
        typeof (item as Todo).completed === 'boolean',
    )
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // storage might be unavailable (private mode, quota, etc.) — silently skip
  }
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const [filter, setFilter] = useState<Filter>('all')
  const [draft, setDraft] = useState('')

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const remaining = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  )
  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  )

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed)
      case 'completed':
        return todos.filter((t) => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  function addTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setTodos((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), text, completed: false },
    ])
    setDraft('')
  }

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function editTodo(id: number, text: string) {
    const next = text.trim()
    if (!next) {
      deleteTodo(id)
      return
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: next } : t)),
    )
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Todos
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          A simple, focused task list.
        </p>
      </header>

      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <form
          onSubmit={addTodo}
          className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4"
        >
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded-full border-2 border-slate-300 text-transparent"
          >
            ✓
          </span>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
            aria-label="New todo"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add
          </button>
        </form>

        {todos.length > 0 && (
          <ul className="divide-y divide-slate-200">
            {visibleTodos.length === 0 && (
              <li className="px-6 py-10 text-center text-sm text-slate-400">
                {filter === 'active'
                  ? 'Nothing active — nice work.'
                  : 'No completed tasks yet.'}
              </li>
            )}
            {visibleTodos.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onEdit={(text) => editTodo(todo.id, text)}
              />
            ))}
          </ul>
        )}

        {todos.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            Add your first task above ↑.
          </div>
        )}

        {todos.length > 0 && (
          <footer className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>
              <strong className="font-semibold text-slate-700">
                {remaining}
              </strong>{' '}
              {remaining === 1 ? 'item' : 'items'} left
            </span>

            <div
              role="tablist"
              aria-label="Filter todos"
              className="flex items-center gap-1 rounded-lg bg-slate-100 p-1"
            >
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  role="tab"
                  aria-selected={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    filter === f.value
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={clearCompleted}
              disabled={completedCount === 0}
              className="self-end rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300 sm:self-auto"
            >
              Clear completed{completedCount > 0 ? ` (${completedCount})` : ''}
            </button>
          </footer>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-slate-400">
        Saved locally to your browser.
      </p>
    </main>
  )
}

type TodoRowProps = {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
  onEdit: (text: string) => void
}

function TodoRow({ todo, onToggle, onDelete, onEdit }: TodoRowProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function commit() {
    onEdit(draft)
    setEditing(false)
  }

  function cancel() {
    setDraft(todo.text)
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            else if (e.key === 'Escape') cancel()
          }}
          className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          aria-label="Edit todo"
        />
      </li>
    )
  }

  return (
    <li className="group flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50 sm:px-6">
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.completed}
        onClick={onToggle}
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ${
          todo.completed
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-300 text-transparent hover:border-slate-400'
        }`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        ✓
      </button>

      <button
        type="button"
        onDoubleClick={() => setEditing(true)}
        onClick={(e) => {
          // single click on text toggles; double-click enters edit mode
          // but the click also fires, so we only toggle on the *first* click of a dblclick sequence
          // by checking detail (click count)
          if (e.detail < 2) onToggle()
        }}
        className={`flex-1 cursor-pointer truncate text-left text-base transition ${
          todo.completed ? 'text-slate-400 line-through' : 'text-slate-800'
        }`}
        title="Double-click to edit"
      >
        {todo.text}
      </button>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Edit todo"
          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M2.695 14.763l-1.262 3.155a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.886L17.5 5.5a2.121 2.121 0 00-3-3L3.713 13.287a4 4 0 00-.886 1.343z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete todo"
          className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 101.23.616c.81-.127 1.654-.232 2.515-.304v.946a.75.75 0 001.5 0V5.05c.865.07 1.722.177 2.534.313a.75.75 0 00.616-1.38A31.04 31.04 0 008.75 3.193v-.443A2.75 2.75 0 0011.25 3.75v.443a31.2 31.2 0 00-2.534.313.75.75 0 00.616 1.38c.812-.136 1.669-.243 2.534-.313v1.677a.75.75 0 001.5 0V5.05c.86.072 1.704.177 2.515.304a.75.75 0 00.616-1.38A31.2 31.2 0 0014.366 3.65V3.75A2.75 2.75 0 0011.596 1H8.75zM4.5 8.25a.75.75 0 00-.75.75v6.5A2.75 2.75 0 006.5 18.25h7A2.75 2.75 0 0016.25 15.5V9a.75.75 0 00-1.5 0v6.5a1.25 1.25 0 01-1.25 1.25h-7A1.25 1.25 0 015.25 15.5V9a.75.75 0 00-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  )
}
