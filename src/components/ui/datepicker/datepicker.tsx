'use client'

import { cn } from '@/lib/utils'
import { Label } from '../label'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { ComponentProps } from 'react'
import type { TaskSchemaInfer } from '@/schemas'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useFormContext, useController } from 'react-hook-form'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type DatePickerProps = ComponentProps<typeof Calendar> & {
  containerClassname?: string
  label?: string
  name: keyof TaskSchemaInfer
}

export const DatePicker = ({
  containerClassname,
  label,
  name,
}: DatePickerProps) => {
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

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value
              ? format(value as Date, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })
              : 'Selecionar Dia...'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value as Date}
            onSelect={onChange}
            initialFocus
            locale={ptBR}
            fromDate={new Date()} // Impede seleção de datas passadas
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
