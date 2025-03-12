import axios from 'axios'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { type TaskSchemaInfer } from '@/schemas'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

interface ModalProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  tasks: TaskSchemaInfer
}

export const Modal = ({ tasks, openModal, setOpenModal }: ModalProps) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`http://localhost:3001/tasks/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }) // Atualiza os dados após exclusão
      toast({
        title: 'Tarefa excluída',
        description: `A tarefa com código ${tasks.id} foi excluída com sucesso.`,
      })
      setOpenModal(false)
    },
  })

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deseja excluir esta tarefa?</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita, isso excluirá permanentemente sua
            tarefa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={() => mutation.mutate(tasks.id)}
            disabled={mutation.isPending} // Evita múltiplos cliques durante a requisição
          >
            {mutation.isPending ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
