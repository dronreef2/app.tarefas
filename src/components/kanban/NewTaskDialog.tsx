import * as React from 'react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type NewTaskDialogProps = {
  onCreate: (title: string) => void
}

export function NewTaskDialog({ onCreate }: NewTaskDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  function reset() {
    setValue('')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const title = value.trim()
    if (!title) return
    onCreate(title)
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          // focus input after the dialog opens
          setTimeout(() => inputRef.current?.focus(), 50)
        } else {
          reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button data-testid="new-task-trigger">
          <Plus className="size-4" />
          Nova tarefa
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Nova tarefa</DialogTitle>
            <DialogDescription>
              Dê um título curto e objetivo. Pressione Enter para adicionar.
            </DialogDescription>
          </DialogHeader>

          <Input
            ref={inputRef}
            data-testid="new-task-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ex: Escrever README do projeto"
            aria-label="Título da tarefa"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              data-testid="new-task-submit"
              disabled={!value.trim()}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
