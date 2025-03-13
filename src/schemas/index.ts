import { z } from 'zod'

export const TaskSchema = z.object({
  date: z.date(),
  priority: z.number().array(),
  type: z.string().min(1, 'Tipo da tarefa é obrigatório'),
  status: z.boolean(),
  title: z
    .string({ message: 'Preencher este campo!' })
    .min(10, 'Minimo de caracter é 10')
    .max(30, 'Maximo de caracter é 30'),
  description: z.string().max(200, 'Maximo de caracter é 200'),
  id: z.string(),
})

export type TaskSchemaInfer = z.infer<typeof TaskSchema>

export const intialState = {
  id: '',
  title: '',
  description: '',
  type: '',
  priority: [5],
  status: true,
  date: new Date(),
}
