import Button from '@shared/buttons/Button'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'

export default function CloseConfirmModal({ open, onConfirm, onCancel }) {
  return (
    <Modal open={open} preventBackdropClose preventEscClose hideClose>
      <div className="p-6 text-center">
        <H1 className="mb-10">
          Do you want to exit and lose the changes you made?
        </H1>

        <div className="flex justify-center gap-4">
          <Button size="large" color="neutral" onClick={onCancel}>
            Continue
          </Button>
          <Button size="large" color="error" onClick={onConfirm}>
            Exit
          </Button>
        </div>
      </div>
    </Modal>
  )
}
