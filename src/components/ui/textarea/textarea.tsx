import { Textarea } from '.'
import { Label } from '../label'
import type { TaskSchemaInfer } from '@/schemas'
import { ComponentProps } from 'react'

import { useFormContext } from 'react-hook-form'

type TextAreaProps = ComponentProps<typeof Textarea> & {
  containerClassname?: string
  label?: string
  name: keyof TaskSchemaInfer
}

export const TextAreaCustom = ({
  containerClassname,
  label,
  name,
  ...props
}: TextAreaProps) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<TaskSchemaInfer>()

  return (
    <div className={containerClassname}>
      {label && (
        <Label htmlFor={name} className="text-right">
          {label}
        </Label>
      )}

      <Textarea {...register(name)} className="col-span-3" {...props} />
      {errors[name] && (
        <span className="text-sm font-semibold text-red-500">
          {errors[name]?.message}
        </span>
      )}
      {watch(name).length === 200 && (
        <span className="col-span-4 text-center text-xs font-semibold text-red-500">
          Descrição não pode ultrapassar 200 caracteres.
        </span>
      )}
    </div>
  )
}
