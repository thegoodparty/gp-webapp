'use client'

import { ChevronRight, Lock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@styleguide/lib/utils'
import TaskCheckbox from '../../components/tasks/TaskCheckbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@styleguide'

interface TaskItemProps {
  title: string
  description: string
  date: string | Date
  type: string
  checked?: boolean
  locked?: boolean
  noLongerAvailable?: boolean
  lockedReason?: string
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
  lockedReason = '',
  link,
  onCheckedChange,
  onClick,
  onAction,
  className,
}: TaskItemProps) {
  const opensInNewTab = typeof link === 'string' && /^https?:\/\//i.test(link)
  const isClickable =
    !noLongerAvailable &&
    (Boolean(onClick) || Boolean(onAction) || Boolean(link))

  const runCallbacks = () => {
    if (onClick) {
      onClick()
    } else {
      onAction?.()
    }
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

  const contentClassName = cn(
    'flex min-w-0 flex-1 items-center overflow-hidden py-3 pr-4',
    isClickable && 'group cursor-pointer',
  )

  const interactiveClassName = cn(
    contentClassName,
    'w-full min-w-0 border-0 bg-transparent pl-0 text-left font-inherit text-inherit no-underline outline-offset-2',
  )

  const body = (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 text-base font-medium text-base-foreground group-hover:text-primary  line-clamp-1">
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
              className="shrink-0 text-base-foreground md:opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-primary"
            />
          )
        )}
      </div>
      {description && (
        <p className="text-sm text-base-muted-foreground line-clamp-1">
          {description}
        </p>
      )}
      <div className="flex items-start gap-1 pt-1 text-xs text-base-muted-foreground">
        <span>{formattedDate}</span>
        {date && type && <span>•</span>}
        <span>{type}</span>
      </div>
    </div>
  )

  const mainArea = !isClickable ? (
    <div className={contentClassName}>{body}</div>
  ) : opensInNewTab && link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={interactiveClassName}
      onClick={() => {
        runCallbacks()
      }}
    >
      {body}
    </a>
  ) : link ? (
    <a
      href={link}
      className={interactiveClassName}
      onClick={(e) => {
        if (onClick || onAction) {
          e.preventDefault()
          runCallbacks()
        }
      }}
    >
      {body}
    </a>
  ) : (
    <button
      type="button"
      className={interactiveClassName}
      onClick={runCallbacks}
    >
      {body}
    </button>
  )

  return (
    <div
      data-slot="task-item"
      className={cn('flex w-full items-center font-opensans', className)}
    >
      <div className="flex shrink-0 items-start justify-center self-stretch pb-3 pl-4 pr-3 pt-3.5">
        {locked ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Lock
                size={20}
                strokeWidth={1.5}
                className="text-base-foreground ml-3"
              />
            </TooltipTrigger>
            <TooltipContent>{lockedReason}</TooltipContent>
          </Tooltip>
        ) : (
          <TaskCheckbox checked={checked} onCheckedChange={onCheckedChange} />
        )}
      </div>
      {mainArea}
    </div>
  )
}
