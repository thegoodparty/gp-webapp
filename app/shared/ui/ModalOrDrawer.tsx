'use client'

import { useTailwindBreakpoints } from '@shared/hooks/useTailwindBreakpoints'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@styleguide/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from '@styleguide/components/ui/drawer'
import { XMarkIcon } from '@styleguide/components/ui/icons'

interface ModalOrDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title: string
  dialogClassName?: string
  drawerClassName?: string
}

export function ModalOrDrawer({
  open,
  onOpenChange,
  children,
  title,
  dialogClassName,
  drawerClassName,
}: ModalOrDrawerProps) {
  const breakpoint = useTailwindBreakpoints()
  const isSmall = breakpoint === 'xs' || breakpoint === 'sm'

  if (isSmall) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={drawerClassName}>
          <DrawerTitle className="sr-only">{title}</DrawerTitle>
          <DrawerClose className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden">
            <XMarkIcon />
            <span className="sr-only">Close</span>
          </DrawerClose>
          {children}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogClassName}>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  )
}
