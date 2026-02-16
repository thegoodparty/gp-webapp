'use client'

import * as React from 'react'
import MuiModal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { IoIosCloseCircle } from 'react-icons/io'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'white',
  boxShadow: 8,
  p: 4,
  borderRadius: 2,
  outline: 'none',
  maxHeight: '90vh',
  minWidth: 280,
  overflowY: 'auto',
} as const

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
  disableEnforceFocus = false,
}: ModalProps): React.JSX.Element => {
  const handleClose = (_e: React.SyntheticEvent, reason: string) => {
    if (
      (reason === 'backdropClick' && preventBackdropClose) ||
      (reason === 'escapeKeyDown' && preventEscClose)
    ) {
      return
    }
    closeCallback()
  }
  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      disableEnforceFocus={disableEnforceFocus}
    >
      <Box
        className={`!min-w-[calc(100%-theme(space.4))] sm:!min-w-[500px] sm:!p-4 md:!p-8 ${boxClassName}`}
        sx={style}
        style={boxStyle}
      >
        {!hideClose && (
          <div
            className="absolute top-4 right-4 cursor-pointer w-7 h-7 flex items-center justify-center modal-close"
            onClick={closeCallback}
          >
            <IoIosCloseCircle size={24} />
          </div>
        )}
        {children}
      </Box>
    </MuiModal>
  )
}

export default Modal
