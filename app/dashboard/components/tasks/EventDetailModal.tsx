'use client'

import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'
import { Button } from '@styleguide'
import { CalendarDays, Handshake } from 'lucide-react'
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

  return (
    <ModalOrDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
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
            <Handshake className="h-4 w-4 text-base-muted-foreground" />
            <span>{displayType}</span>
          </div>
          {date && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-base-muted-foreground" />
              <span>{dateUsHelper(date.slice(0, 10).replace(/-/g, '/'))}</span>
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
