'use client'

import { ReactNode } from 'react'
import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'

interface ResponsiveModalProps {
  open: boolean
  onClose?: () => void
  title?: string
  children?: ReactNode
  preventBackdropClose?: boolean
  preventEscClose?: boolean
  hideClose?: boolean
  fullSize?: boolean
}

const ResponsiveModal = ({
  open,
  onClose,
  title = '',
  children,
}: ResponsiveModalProps) => (
  <ModalOrDrawer
    open={open}
    onOpenChange={(next) => {
      if (!next) onClose?.()
    }}
    title={title}
  >
    {children}
  </ModalOrDrawer>
)

export default ResponsiveModal
