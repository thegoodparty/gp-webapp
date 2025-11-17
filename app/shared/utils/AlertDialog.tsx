'use client'
import React, { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'

interface AlertDialogProps {
  handleClose: () => void
  handleProceed: () => void
  open: boolean
  title?: string
  description?: string | ReactNode
  ariaLabel?: string
  redButton?: boolean
  cancelLabel?: string
  proceedLabel?: string
  onCancel?: () => void
}

const AlertDialog = ({
  handleClose,
  handleProceed,
  open,
  title,
  description,
  ariaLabel,
  redButton = true,
  cancelLabel = 'Cancel',
  proceedLabel = 'Proceed',
  onCancel,
}: AlertDialogProps) => {
  const handleCancel = (): void => {
    if (onCancel && typeof onCancel === 'function') {
      onCancel()
      return
    }
    handleClose()
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby={title || ariaLabel}
      open={open}
      PaperProps={{ sx: { borderRadius: '20px' } }}
    >
      <div className="p-16">
        <div
          className="text-3xl flex items-center font-black"
          id="alert-dialog-title"
        >
          <H1 className="mb-4 text-center w-full">{title}</H1>
        </div>
        <Body2 className="mx-0 mb-8 text-center">
          {description}
        </Body2>
        <div className="flex items-center justify-center">
          <Button
            className="mr-2"
            variant="contained"
            color="neutral"
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleProceed}
            color={redButton ? 'error' : 'primary'}
            variant="contained"
          >
            {proceedLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default AlertDialog

