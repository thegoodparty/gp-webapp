'use client'

import { useTailwindBreakpoints } from '@shared/hooks/useTailwindBreakpoints'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@styleguide/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@styleguide/components/ui/drawer'

interface ModalOrDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title: string
  description?: string
  dialogClassName?: string
  drawerClassName?: string
}

export function ModalOrDrawer({
  open,
  onOpenChange,
  children,
  title,
  description,
  dialogClassName,
  drawerClassName,
}: ModalOrDrawerProps) {
  const breakpoint = useTailwindBreakpoints()
  const isSmall = breakpoint === 'xs' || breakpoint === 'sm'

  if (isSmall) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className={drawerClassName}
          aria-describedby={description ? undefined : undefined}
        >
          <DrawerTitle className="sr-only">{title}</DrawerTitle>
          {description ? (
            <DrawerDescription className="sr-only">
              {description}
            </DrawerDescription>
          ) : null}
          {children}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={dialogClassName}
        aria-describedby={description ? undefined : undefined}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {description ? (
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        ) : null}
        {children}
      </DialogContent>
    </Dialog>
  )
}
