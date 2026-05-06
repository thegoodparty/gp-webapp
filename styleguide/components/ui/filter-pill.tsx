'use client'

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cn } from '@styleguide/lib/utils'

const pillClass = cn(
  'inline-flex items-center justify-center rounded-full border border-base-border bg-base-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors',
  'hover:bg-muted',
  'data-[state=on]:border-brand-midnight-900 data-[state=on]:bg-brand-midnight-900 data-[state=on]:text-white',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-midnight-900 focus-visible:ring-offset-1',
  'disabled:pointer-events-none disabled:opacity-50',
)

interface FilterPillGroupProps
  extends React.ComponentProps<typeof ToggleGroupPrimitive.Root> {
  type?: 'single'
}

function FilterPillGroup({
  className,
  children,
  ...props
}: FilterPillGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      className={cn('flex flex-wrap gap-2', className)}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  )
}

interface FilterPillProps
  extends React.ComponentProps<typeof ToggleGroupPrimitive.Item> {}

function FilterPill({ className, children, ...props }: FilterPillProps) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(pillClass, className)}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { FilterPillGroup, FilterPill }
