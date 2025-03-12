import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '.'
import { Label } from '../label'
import type { TaskSchemaInfer } from '@/schemas'
import { ComponentProps, useEffect } from 'react'

import { useFormContext } from 'react-hook-form'

type SelectProps = ComponentProps<typeof Select> & {
  containerClassname?: string
  label?: string
  name: keyof TaskSchemaInfer
}

const types = [
  {
    id: 1,
    value: 'Diaria',
    item: 'Diária',
  },
  {
    id: 2,
    value: 'Semanal',
    item: 'Semanal',
  },
  {
    id: 3,
    value: 'Mensal',
    item: 'Mensal',
  },
  {
    id: 4,
    value: 'Anual',
    item: 'Anual',
  },
]

export const SelectCustom = ({
  containerClassname,
  label,
  name,
  ...props
}: SelectProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TaskSchemaInfer>()

  // Assiste o valor do campo no formulário
  const selectedValue = watch(name)

  // Se precisar definir um valor inicial (em caso de atualização)
  useEffect(() => {
    if (!selectedValue) {
      setValue(name, '') // Defina o valor inicial como desejado
    }
  }, [name, selectedValue, setValue])

  return (
    <div className={containerClassname}>
      {label && (
        <Label htmlFor={name} className="text-right">
          {label}
        </Label>
      )}
      <div className="col-span-3">
        <Select
          value={String(selectedValue)}
          onValueChange={(value) => setValue(name, value)}
          {...props}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar tipo da tarefa..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectLabel>Tipo da Tarefa</SelectLabel> */}
              {types.map((type) => {
                return (
                  <SelectItem key={type.id} value={type.value}>
                    {type.item}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors[name] && (
          <p className="mt-1 text-sm text-red-500">
            {errors[name]?.message?.toString()}
          </p>
        )}
      </div>
    </div>
  )
}
