'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '@styleguide/lib/utils'
import { Label } from './label'

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'border-base-border focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border bg-white shadow-xs transition-[border-color,border-width,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-4 data-[state=checked]:border-components-input-active',
        className,
      )}
      {...props}
    />
  )
}

interface RadioCardItemProps {
  value: string
  id: string
  title: string
  description?: string
  className?: string
}

function RadioCardItem({
  value,
  id,
  title,
  description,
  className,
}: RadioCardItemProps) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-lg border border-base-border bg-base-surface p-3 transition-colors',
        'has-[[data-state=checked]]:border-components-input-active has-[[data-state=checked]]:bg-base-surface has-[[data-state=checked]]:ring-1 has-[[data-state=checked]]:ring-components-input-active',
        className,
      )}
    >
      <RadioGroupItem value={value} id={id} className="mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-medium text-foreground">{title}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
    </Label>
  )
}

export { RadioGroup, RadioGroupItem, RadioCardItem }
