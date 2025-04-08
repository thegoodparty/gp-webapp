import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'

export default function CloseConfirmModal({ open, onConfirm, onCancel }) {
  return (
    <Modal open={open} preventBackdropClose preventEscClose hideClose>
      <div className="p-6 text-center">
        <H1 className="mb-4">Are you sure you want to exit?</H1>
        <Body1 className="mb-10">
          Leaving now means you&apos;ll need to start over next time you
          schedule a campaign.
        </Body1>
        <div className="flex justify-center gap-4">
          <Button color="neutral" size="large" onClick={onConfirm}>
            Exit Without Saving
          </Button>
          <Button size="large" onClick={onCancel}>
            Continue Scheduling
          </Button>
        </div>
      </div>
    </Modal>
  )
}
