import { Input } from '.'
import { Label } from '../label'
import type { TaskSchemaInfer } from '@/schemas'
import { ComponentProps } from 'react'

import { useFormContext } from 'react-hook-form'

type InputFieldProps = ComponentProps<typeof Input> & {
  containerClassname?: string
  label?: string
  name: keyof TaskSchemaInfer
}

export const InputField = ({
  containerClassname,
  label,
  name,
  ...props
}: InputFieldProps) => {
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

      <Input {...register(name)} className="col-span-3" {...props} />
      {errors[name] && (
        <span className="col-span-4 text-center text-xs font-semibold text-red-500">
          {errors[name]?.message}
        </span>
      )}
      {watch('title').length === 30 && (
        <span className="col-span-4 text-center text-xs font-semibold text-red-500">
          Descrição não pode ultrapassar 30 caracteres.
        </span>
      )}
    </div>
  )
}
