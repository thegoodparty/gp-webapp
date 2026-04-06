'use client'

import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'

interface EventDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
}

export default function EventDetailModal({
  open,
  onOpenChange,
  title,
  description,
}: EventDetailModalProps) {
  return (
    <ModalOrDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      dialogClassName="max-w-md"
    >
      {description ? (
        <div className="p-6">
          <p className="text-sm text-base-muted-foreground">{description}</p>
        </div>
      ) : null}
    </ModalOrDrawer>
  )
}
