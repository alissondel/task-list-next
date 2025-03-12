import type { ComponentProps } from 'react'
import { Button } from '.'

type ButtonCustomProps = ComponentProps<typeof Button> & {
  containerClassname?: string
  name: string
}

export const ButtonCustom = ({
  containerClassname,
  name,
  ...props
}: ButtonCustomProps) => {
  return (
    <div className={containerClassname}>
      <Button {...props}>{name}</Button>
    </div>
  )
}
