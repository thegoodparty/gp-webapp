import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'
import { useMemo } from 'react'

const SUPPORT_EMAIL = 'politics@goodparty.org'

interface DeadlineModalProps {
  type: string
  deadline: number
  onClose: () => void
}

export default function DeadlineModal({
  type,
  deadline,
  onClose,
}: DeadlineModalProps): React.JSX.Element {
  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Deadline Missed Email Button', {
        type,
        deadline,
      }),
    [type, deadline],
  )
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
          <Button
            href={`mailto:${SUPPORT_EMAIL}?subject=Last minute ${type} request`}
            target="_blank"
            size="large"
            color="neutral"
            onClick={onClose}
            {...trackingAttrs}
          >
            Email our team
          </Button>
        </div>
      </div>
    </Modal>
  )
}
