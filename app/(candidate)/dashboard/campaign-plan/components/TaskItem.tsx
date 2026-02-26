'use client'

import { useState } from 'react'
import { ChevronRight, Lock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@styleguide/lib/utils'
import TaskCheckbox from '../../components/tasks/TaskCheckbox'

interface TaskItemProps {
  title: string
  description: string
  date: string | Date
  type: string
  checked?: boolean
  locked?: boolean
  onCheckedChange?: (checked: boolean) => void
  onClick?: () => void
  className?: string
}

export default function TaskItem({
  title,
  description,
  date,
  type,
  checked = false,
  locked = false,
  onCheckedChange,
  onClick,
  className,
}: TaskItemProps) {
  const [hovered, setHovered] = useState(false)

  const formattedDate =
    typeof date === 'string' ? date : format(date, 'MMM d')

  return (
    <div
      data-slot="task-item"
      className={cn('flex w-full items-center', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex shrink-0 items-start justify-center self-stretch pb-3 pl-4 pr-3 pt-3.5">
        {locked ? (
          <Lock size={20} strokeWidth={1.5} className="text-base-foreground" />
        ) : (
          <TaskCheckbox checked={checked} onCheckedChange={onCheckedChange} />
        )}
      </div>
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center overflow-hidden py-3 pr-4',
          onClick && 'cursor-pointer',
        )}
        onClick={onClick}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-base leading-[22px] font-medium text-base-foreground">
              {title}
            </p>
            {hovered && onClick && (
              <ChevronRight size={15} className="shrink-0 text-base-foreground" />
            )}
          </div>
          {description && (
            <p className="truncate text-sm text-base-muted-foreground">
              {description}
            </p>
          )}
          <div className="flex items-start gap-1 pt-1 text-xs text-base-muted-foreground">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{type}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
