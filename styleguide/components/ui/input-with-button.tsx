'use client'

import * as React from 'react'
import { cn } from '@styleguide/lib/utils'
import { Input } from './input'
import { Button, type ButtonProps } from './button'
import { Label } from './label'

interface InputWithButtonProps extends Omit<
  React.ComponentProps<'input'>,
  'children'
> {
  label?: string
  showLabel?: boolean
  buttonLabel: React.ReactNode
  buttonProps?: Omit<ButtonProps, 'children'>
  layout?: 'inline' | 'stacked'
}

function InputWithButton({
  label,
  showLabel = true,
  buttonLabel,
  buttonProps,
  layout = 'inline',
  id,
  className,
  ...inputProps
}: InputWithButtonProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {showLabel && label ? <Label htmlFor={inputId}>{label}</Label> : null}
      <div
        className={cn(
          'flex gap-2',
          layout === 'inline' ? 'items-center' : 'flex-col',
        )}
      >
        <Input
          id={inputId}
          className={cn(layout === 'inline' && 'w-auto flex-1 min-w-0')}
          {...inputProps}
        />
        <Button
          variant="default"
          {...buttonProps}
          className={cn(
            layout === 'stacked' && 'w-full',
            buttonProps?.className,
          )}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}

export { InputWithButton, type InputWithButtonProps }
