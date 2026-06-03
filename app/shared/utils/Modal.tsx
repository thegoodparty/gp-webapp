'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@styleguide/components/ui/dialog'
import { cn } from '@styleguide/lib/utils'

interface ModalProps {
  open: boolean
  closeCallback: () => void
  children: React.ReactNode
  boxClassName?: string
  boxStyle?: React.CSSProperties
  preventBackdropClose?: boolean
  preventEscClose?: boolean
  hideClose?: boolean
  /** Disable MUI's focus-enforcement trap. Required when the modal contains
   *  third-party iframes (e.g. Stripe PaymentElement) that need to receive focus. */
  disableEnforceFocus?: boolean
}

const Modal = ({
  open,
  closeCallback,
  children,
  boxClassName = '',
  boxStyle = {},
  preventBackdropClose = false,
  preventEscClose = false,
  hideClose = false,
  disableEnforceFocus: _disableEnforceFocus = false,
}: ModalProps): React.JSX.Element => (
  <Dialog open={open} onOpenChange={(next) => !next && closeCallback()}>
    <DialogContent
      className={cn(
        '!min-w-[calc(100%-theme(space.4))] sm:!min-w-[500px] sm:!p-4 md:!p-8 max-h-[90vh] overflow-y-auto',
        hideClose && '[&>button:last-child]:hidden',
        boxClassName,
      )}
      style={boxStyle}
      onInteractOutside={(e) => {
        if (preventBackdropClose) e.preventDefault()
      }}
      onEscapeKeyDown={(e) => {
        if (preventEscClose) e.preventDefault()
      }}
    >
      <DialogTitle className="sr-only">Dialog</DialogTitle>
      {children}
    </DialogContent>
  </Dialog>
)

export default Modal
