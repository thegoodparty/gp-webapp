'use client'

import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'
import { CalendarCheck } from 'lucide-react'
import type { Task } from './TaskItem'

interface AwarenessDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  formattedDate: string
}

export default function AwarenessDetailModal({
  open,
  onOpenChange,
  task,
  formattedDate,
}: AwarenessDetailModalProps) {
  const { title, description } = task

  return (
    <ModalOrDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description || 'Task details'}
      dialogClassName="max-w-md"
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

        {formattedDate && (
          <div className="flex items-center gap-2 text-sm">
            <CalendarCheck className="h-4 w-4 text-base-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </ModalOrDrawer>
  )
}
