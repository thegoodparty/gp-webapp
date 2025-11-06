'use client'

import { BsExclamationCircle } from 'react-icons/bs'
import { Alert, AlertTitle, Button } from 'goodparty-styleguide'
import Body2 from '@shared/typography/Body2'
import { usePoll } from './hooks/PollProvider'
import Link from 'next/link'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import { dateUsHelper } from 'helpers/dateHelper'
import { POLL_STATUS } from './constants'

export default function ConfidenceAlert() {
  const [poll] = usePoll()
  const { ready: flagsReady, on: expandAccessEnabled } = useFlagOn(
    'serve-polls-expansion',
  )
  if (!flagsReady || !expandAccessEnabled) {
    return null
  }

  const { lowConfidence } = poll || {}

  if (poll.status === POLL_STATUS.EXPANDING) {
    return (
      <Alert variant="info">
        <AlertTitle>
          <div className="flex flex-col gap-4 md:flex-row justify-between">
            <div className="flex gap-2 text-blue-500">
              <BsExclamationCircle className="mt-0.5" />
              <div>
                <div className="font-medium">Gathering Feedback</div>
                <Body2>
                  We are currently gathering more feedback on this poll. Results
                  are expected {dateUsHelper(poll.estimatedCompletionDate)} at
                  11:00 AM.
                </Body2>
              </div>
            </div>
          </div>
        </AlertTitle>
      </Alert>
    )
  }
  if (lowConfidence) {
    return (
      <Alert variant="destructive">
        <AlertTitle>
          <div className="flex flex-col gap-4 md:flex-row justify-between">
            <div className="flex gap-2 text-red-500">
              <BsExclamationCircle className="mt-0.5" />
              <div>
                <div className="font-medium">Poll Confidence: Low</div>
                <Body2>
                  The results of your poll are not conclusive. We recommend you
                  run the same poll to a larger sample of residents.
                </Body2>
              </div>
            </div>
            <Link href={`/dashboard/polls/${poll.id}/expand`}>
              <Button variant="destructive">Gather more feedback</Button>
            </Link>
          </div>
        </AlertTitle>
      </Alert>
    )
  } else {
    return (
      <Alert variant="success">
        <AlertTitle>
          <div className="flex gap-2 text-green-500">
            <BsExclamationCircle className="mt-0.5" />
            <div>
              <div className="font-medium">Poll Confidence: High</div>
              <Body2>
                The results of your poll are statistically reliable enough that
                you can act on them with confidence.
              </Body2>
            </div>
          </div>
        </AlertTitle>
      </Alert>
    )
  }
}
