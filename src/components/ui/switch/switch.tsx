import { Switch } from '.'
import { Label } from '../label'
import type { TaskSchemaInfer } from '@/schemas'
import { ComponentProps } from 'react'

import { useFormContext, useController } from 'react-hook-form'

type InputFieldProps = ComponentProps<typeof Switch> & {
  containerClassname?: string
  label?: string
  name: keyof TaskSchemaInfer
}

export const SwitchCustom = ({
  containerClassname,
  label,
  name,
  ...props
}: InputFieldProps) => {
  const { control } = useFormContext<TaskSchemaInfer>()
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  })

  return (
    <div className={containerClassname}>
      {label && (
        <Label htmlFor={name} className="text-right">
          {label}
        </Label>
      )}
      <div className="flex gap-4">
        <Switch
          checked={value === undefined ? true : !!value}
          onCheckedChange={onChange}
          className="col-span-3"
          {...props}
        />
        <span className="text-center">{value ? 'Ativo' : 'Inativo'}</span>
      </div>
    </div>
  )
}
