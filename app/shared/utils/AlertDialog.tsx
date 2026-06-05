'use client'
import { ReactNode } from 'react'
import {
  AlertDialog as AlertDialogRoot,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@styleguide/components/ui/alert-dialog'
import { cn } from '@styleguide/lib/utils'
import { buttonVariants } from '@styleguide/components/ui/button'

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
    <AlertDialogRoot open={open}>
      <AlertDialogContent className="rounded-[20px]">
        <AlertDialogHeader className="items-center">
          {title && (
            <AlertDialogTitle className="text-3xl font-black text-center">
              {title}
            </AlertDialogTitle>
          )}
          {description && (
            <AlertDialogDescription className="text-center text-base">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center sm:justify-center">
          <AlertDialogCancel onClick={handleCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleProceed}
            className={cn(
              redButton
                ? buttonVariants({ variant: 'destructive' })
                : buttonVariants({ variant: 'default' }),
            )}
          >
            {proceedLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  )
}

export default AlertDialog
