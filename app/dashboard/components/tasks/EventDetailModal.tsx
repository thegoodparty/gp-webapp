'use client'

import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'
import { Button } from '@styleguide'
import { Calendar, Globe } from 'lucide-react'
import { dateUsHelper } from 'helpers/dateHelper'
import { DISPLAY_TASK_TYPES } from '../../shared/constants/tasks.const'
import type { Task } from './TaskItem'
import Link from 'next/link'

interface EventDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
}

export default function EventDetailModal({
  open,
  onOpenChange,
  task,
}: EventDetailModalProps) {
  const { title, description, flowType, date, link } = task
  const displayType = DISPLAY_TASK_TYPES[flowType] ?? 'Event'
  const formattedDate = date
    ? dateUsHelper(date.slice(0, 10).replace(/-/g, '/'), 'long')
    : null
  const modalDescription = [
    description,
    displayType,
    formattedDate ? `Date: ${formattedDate}` : null,
    link ? 'Includes an external link for more details.' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ModalOrDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={modalDescription || 'Event details'}
      dialogClassName="max-w-md "
    >
      <div className="flex flex-col gap-4 p-4 md:p-1">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-base-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-base-muted-foreground" />
            <span>{displayType}</span>
          </div>
          {date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-base-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {link && (
          <div className="flex justify-end">
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              <Button className="w-full md:w-auto">Learn more</Button>
            </Link>
          </div>
        )}
      </div>
    </ModalOrDrawer>
  )
}
