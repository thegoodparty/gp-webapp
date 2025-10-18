'use client'

import { BsExclamationCircle } from 'react-icons/bs'
import { Alert, AlertTitle, Button } from 'goodparty-styleguide'
import Body2 from '@shared/typography/Body2'
import { usePoll } from './hooks/PollProvider'
import Link from 'next/link'

export default function ConfidenceAlert() {
  const [poll] = usePoll()
  const { lowConfidence } = poll || {}
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
