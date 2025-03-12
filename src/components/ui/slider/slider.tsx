import { Slider } from '.'
import { Label } from '../label'
import type { TaskSchemaInfer } from '@/schemas'
import { ComponentProps } from 'react'

import { useController, useFormContext } from 'react-hook-form'

type SliderProps = ComponentProps<typeof Slider> & {
  containerClassname?: string
  label?: string
  name: keyof TaskSchemaInfer
}

export const SliderCustom = ({
  containerClassname,
  label,
  name,
  ...props
}: SliderProps) => {
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

      <Slider
        className="col-span-3"
        max={10}
        step={1}
        value={value as number[]}
        onValueChange={onChange}
        {...props}
      />
      <span className="col-span-4 pl-24 text-center">{value}</span>
    </div>
  )
}
