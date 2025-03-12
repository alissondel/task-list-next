import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'
import { InputField } from '@/components/ui/input/field'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import { ButtonCustom } from '@/components/ui/button/button'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { intialState, TaskSchema, type TaskSchemaInfer } from '@/schemas'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TextAreaCustom } from '@/components/ui/textarea/textarea'
import { SwitchCustom } from '@/components/ui/switch/switch'
import { SelectCustom } from '@/components/ui/select/select'
import { SliderCustom } from '@/components/ui/slider/slider'

interface FormModalProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  selectedTask: TaskSchemaInfer
}

export const FormModal = ({
  openModal,
  setOpenModal,
  selectedTask,
}: FormModalProps) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const methods = useForm<TaskSchemaInfer>({
    resolver: zodResolver(TaskSchema),
  })

  const { formState, reset, handleSubmit, watch } = methods

  // Observa o valor do select
  const selectedType = watch('type')

  // Verifica se irá criar ou editar as tarefas
  useEffect(() => {
    if (selectedTask.id !== '') return reset(selectedTask)
    else return reset(intialState)
  }, [selectedTask, reset])

  const mutationCreate = useMutation({
    mutationFn: async (task: TaskSchemaInfer) => {
      const data = { ...task, id: uuidv4() }
      const response = await axios.post(`http://localhost:3001/tasks`, data)
      return response.data // Retorna os dados da resposta
    },
    onSuccess: (task: TaskSchemaInfer) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }) // Atualiza os dados após exclusão
      toast({
        title: 'Tarefa criada',
        description: `A tarefa ${task.title} foi criada com sucesso.`,
      })
      setOpenModal(false)
    },
  })

  const mutationUpdate = useMutation({
    mutationFn: async (task: TaskSchemaInfer) => {
      const response = await axios.put(
        `http://localhost:3001/tasks/${task.id}`,
        task,
      )
      return response.data // Retorna os dados da resposta
    },
    onSuccess: (task: TaskSchemaInfer) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }) // Atualiza os dados após exclusão
      toast({
        title: 'Tarefa atualizada',
        description: `A tarefa com código ${task.id} foi atualizada com sucesso.`,
      })
      setOpenModal(false)
    },
  })

  function onSubmit(data: TaskSchemaInfer) {
    if (selectedTask.id !== '') return mutationUpdate.mutate(data)
    else mutationCreate.mutate(data)
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {formState.defaultValues?.title === '' ? 'Criar' : 'Editar'} Tarefas
          </DialogTitle>
          <DialogDescription>
            Faça alterações em suas tarefas aqui. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              name="title"
              label="Titulo:"
              containerClassname="mb-4 grid grid-cols-4 items-center gap-4"
              maxLength={30}
            />
            <TextAreaCustom
              name="description"
              label="Descrição:"
              containerClassname="mb-4 grid grid-cols-4 gap-4"
              className="col-span-3 h-44 p-2"
              maxLength={200}
            />
            <SelectCustom
              name="type"
              label="Tipo da Tarefa:"
              containerClassname="mb-4 grid grid-cols-4 gap-4"
            />
            <SwitchCustom
              name="status"
              label="Status:"
              containerClassname="mb-4 grid grid-cols-4 gap-4"
            />
            <SliderCustom
              name="priority"
              label="Nivel de prioridade:"
              containerClassname="mb-4 grid grid-cols-4 gap-4 "
            />
            <DialogFooter>
              <ButtonCustom
                type="button"
                variant="ghost"
                name="Cancelar"
                onClick={() => setOpenModal(false)}
              />
              <ButtonCustom
                disabled={!(selectedType && selectedType !== '')}
                type="submit"
                variant="ghost"
                name="Salvar"
                className="bg-blue-800 font-semibold text-zinc-100 hover:bg-blue-700 hover:text-zinc-100 disabled:bg-zinc-500"
              />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
