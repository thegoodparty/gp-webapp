'use client'

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
  noLongerAvailable?: boolean
  link?: string
  onCheckedChange?: (checked: boolean) => void
  onClick?: () => void
  onAction?: () => void
  className?: string
}

export default function CampaignPlanTaskItem({
  title,
  description,
  date,
  type,
  checked = false,
  locked = false,
  noLongerAvailable = false,
  link,
  onCheckedChange,
  onClick,
  onAction,
  className,
}: TaskItemProps) {
  const isExternalLink = link !== undefined
  const isClickable =
    (!locked || noLongerAvailable) &&
    (Boolean(onClick) || Boolean(onAction) || isExternalLink)

  const handleClick = () => {
    if (noLongerAvailable) {
      onAction?.()
      return
    }
    if (isExternalLink && link) {
      window.open(link, '_blank')
      return
    }
    if (onClick) {
      onClick()
      return
    }
    onAction?.()
  }

  const formattedDate =
    typeof date === 'string'
      ? date
      : format(
          new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
          ),
          'MMM d',
        )

  return (
    <div
      data-slot="task-item"
      className={cn('flex w-full items-center', className)}
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
          isClickable && 'group cursor-pointer',
        )}
        onClick={isClickable ? handleClick : undefined}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 text-base leading-[22px] font-medium text-base-foreground">
              {title}
            </p>
            {noLongerAvailable ? (
              <Lock
                size={18}
                strokeWidth={1.5}
                className="shrink-0 text-base-foreground"
              />
            ) : (
              isClickable && (
                <ChevronRight
                  size={18}
                  className="shrink-0 text-base-foreground md:opacity-0 transition-opacity group-hover:opacity-100"
                />
              )
            )}
          </div>
          {description && (
            <p className="text-sm text-base-muted-foreground">{description}</p>
          )}
          <div className="flex items-start gap-1 pt-1 text-xs text-base-muted-foreground">
            <span>{formattedDate}</span>
            {date && type && <span>•</span>}
            <span>{type}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
