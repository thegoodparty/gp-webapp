import Button from '@shared/buttons/Button'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'
import { useMemo } from 'react'

interface CloseConfirmModalProps {
  open: boolean
  type: string
  onConfirm: () => void
  onCancel: () => void
}

export default function CloseConfirmModal({
  open,
  type,
  onConfirm,
  onCancel,
}: CloseConfirmModalProps): React.JSX.Element {
  const continueTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Continue Task', { type }),
    [type],
  )

  const exitTrackingAttrs = useMemo(
    () => buildTrackingAttrs('Confirm Exit Task', { type }),
    [type],
  )

  return (
    <Modal
      open={open}
      closeCallback={() => {}}
      preventBackdropClose
      preventEscClose
      hideClose
    >
      <div className="p-6 text-center">
        <H1 className="mb-10">
          Do you want to exit and lose the changes you made?
        </H1>

        <div className="flex justify-center gap-4">
          <Button
            size="large"
            color="neutral"
            onClick={onCancel}
            {...continueTrackingAttrs}
          >
            Continue
          </Button>
          <Button
            size="large"
            color="error"
            onClick={onConfirm}
            {...exitTrackingAttrs}
          >
            Exit
          </Button>
        </div>
      </div>
    </Modal>
  )
}
