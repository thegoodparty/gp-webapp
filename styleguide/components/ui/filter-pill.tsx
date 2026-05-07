'use client'

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cn } from '@styleguide/lib/utils'

const pillClass = cn(
  'inline-flex items-center justify-center rounded-full border border-base-border bg-base-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors',
  'hover:bg-muted',
  'data-[state=on]:border-brand-midnight-900 data-[state=on]:bg-brand-midnight-900 data-[state=on]:text-white',
  'outline-none focus-visible:ring-2 focus-visible:ring-components-input-active focus-visible:ring-offset-1',
  'disabled:pointer-events-none disabled:opacity-50',
)

const ARROW_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

type SingleToggleGroupProps = Extract<
  React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
  { type: 'single' }
>

type FilterPillGroupProps = Omit<SingleToggleGroupProps, 'type'> & {
  type?: 'single'
}

function FilterPillGroup({
  className,
  children,
  onValueChange,
  ...props
}: FilterPillGroupProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!ARROW_KEYS.includes(e.key)) return
    setTimeout(() => {
      const focused = document.activeElement as HTMLElement | null
      const value = focused?.getAttribute('data-value') ?? ''
      if (value) onValueChange?.(value)
    }, 0)
  }

  return (
    <ToggleGroupPrimitive.Root
      type="single"
      className={cn('flex flex-wrap gap-2', className)}
      onKeyDown={handleKeyDown}
      onValueChange={onValueChange}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  )
}

type FilterPillProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item>

function FilterPill({ className, children, value, ...props }: FilterPillProps) {
  return (
    <ToggleGroupPrimitive.Item
      data-value={value}
      value={value}
      className={cn(pillClass, className)}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { FilterPillGroup, FilterPill }
