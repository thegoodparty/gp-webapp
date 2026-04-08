'use client'

import { Circle, CircleCheck, CircleCheckBig } from 'lucide-react'
import { cn } from '@styleguide/lib/utils'

interface TaskCheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export default function TaskCheckbox({
  checked = false,
  onCheckedChange,
  className,
}: TaskCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-slot="task-checkbox"
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        ' p-0 pl-3 group inline-flex cursor-pointer items-center justify-center border-none bg-transparent base-foreground',
        className,
      )}
    >
      {checked ? (
        <CircleCheckBig size={20} strokeWidth={1.5} />
      ) : (
        <>
          <Circle size={20} strokeWidth={1.5} className="group-hover:hidden" />
          <CircleCheck
            size={20}
            strokeWidth={1.5}
            className="hidden group-hover:block"
          />
        </>
      )}
    </button>
  )
}
