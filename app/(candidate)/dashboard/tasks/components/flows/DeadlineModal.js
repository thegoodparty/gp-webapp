import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'

const SUPPORT_EMAIL = 'support@goodparty.org'

export default function DeadlineModal({ deadline, onClose }) {
  return (
    <Modal open={true} closeCallback={onClose}>
      <div className="p-6 text-center">
        <H1 className="mb-6">Deadline missed</H1>
        <Body1 className="mb-10">
          This is no longer available because our team needs at least&nbsp;
          {`${deadline} day${deadline === 1 ? '' : 's'}`} before your election
          day to schedule.
        </Body1>

        <div className="flex justify-center gap-4">
          <Button size="large" color="neutral" onClick={onClose}>
            Ok
          </Button>
        </div>
      </div>
    </Modal>
  )
}
