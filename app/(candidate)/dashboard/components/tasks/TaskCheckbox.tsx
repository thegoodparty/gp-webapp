'use client'

import { useState } from 'react'
import { Circle, CircleCheck, CircleCheckBig } from 'lucide-react'
import { cn } from '@styleguide/lib/utils'

interface TaskCheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export default function TaskCheckbox({ checked = false, onCheckedChange, className }: TaskCheckboxProps) {
  const [hovered, setHovered] = useState(false)

  const Icon = checked ? CircleCheckBig : hovered ? CircleCheck : Circle

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-slot="task-checkbox"
      onClick={() => onCheckedChange?.(!checked)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn('inline-flex cursor-pointer items-center justify-center bg-transparent border-none p-0 base-foreground', className)}
    >
      <Icon size={20} strokeWidth={1.5} />
    </button>
  )
}
