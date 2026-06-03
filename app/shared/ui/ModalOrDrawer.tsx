'use client'

import { useTailwindBreakpoints } from '@shared/hooks/useTailwindBreakpoints'
import { cn } from '@styleguide/lib/utils'
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
  preventOutsideClose?: boolean
  preventEscClose?: boolean
  hideClose?: boolean
  fullSize?: boolean
}

export function ModalOrDrawer({
  open,
  onOpenChange,
  children,
  title,
  description,
  dialogClassName,
  drawerClassName,
  preventOutsideClose = false,
  preventEscClose = false,
  hideClose = false,
  fullSize = false,
}: ModalOrDrawerProps) {
  const breakpoint = useTailwindBreakpoints()
  const isSmall = breakpoint === 'xs' || breakpoint === 'sm'

  if (isSmall) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        dismissible={!preventOutsideClose}
      >
        <DrawerContent
          className={cn(
            hideClose && '[&>button:first-child]:hidden',
            fullSize && 'h-[90vh] max-h-[90vh]',
            drawerClassName,
          )}
          aria-describedby={description ? undefined : undefined}
          onEscapeKeyDown={(e) => {
            if (preventEscClose) e.preventDefault()
          }}
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
        className={cn(
          hideClose && '[&>button:last-child]:hidden',
          fullSize && 'w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh]',
          dialogClassName,
        )}
        aria-describedby={description ? undefined : undefined}
        onInteractOutside={(e) => {
          if (preventOutsideClose) e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          if (preventEscClose) e.preventDefault()
        }}
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
