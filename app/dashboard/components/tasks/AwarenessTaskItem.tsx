'use client'

import { CalendarCheck, ChevronRight } from 'lucide-react'
import { cn } from '@styleguide/lib/utils'

interface AwarenessTaskItemProps {
  title: string
  description: string
  date: string
  onClick: () => void
  className?: string
}

export default function AwarenessTaskItem({
  title,
  description,
  date,
  onClick,
  className,
}: AwarenessTaskItemProps) {
  return (
    <div
      data-slot="task-item"
      className={cn('flex w-full items-center font-opensans', className)}
    >
      <div className="flex shrink-0 items-start justify-center self-stretch pb-3 pl-4 pr-3 pt-3.5">
        <CalendarCheck
          size={20}
          strokeWidth={1.5}
          className="text-base-foreground"
        />
      </div>
      <button
        type="button"
        aria-label={title}
        className="flex min-w-0 flex-1 items-center overflow-hidden py-3 pr-4 group cursor-pointer w-full border-0 bg-transparent pl-0 text-left font-inherit text-inherit no-underline outline-offset-2"
        onClick={onClick}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-base font-medium text-base-foreground group-hover:text-primary">
              {title}
            </p>
            <ChevronRight
              size={18}
              className="shrink-0 text-base-foreground md:opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-primary"
            />
          </div>
          {description && (
            <p className="text-sm text-base-muted-foreground">{description}</p>
          )}
          {date && (
            <div className="flex items-start gap-1 pt-1 text-xs text-base-muted-foreground">
              <span>{date}</span>
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
