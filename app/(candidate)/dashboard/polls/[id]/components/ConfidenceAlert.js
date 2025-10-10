'use client'

import { BsExclamationCircle } from 'react-icons/bs'
import { usePoll } from '../hooks/PollProvider'
import { Alert, AlertTitle } from 'goodparty-styleguide'
import Body2 from '@shared/typography/Body2'
export default function ConfidenceAlert() {
  const [poll] = usePoll()
  const { lowConfidence } = poll || {}
  if (!lowConfidence) {
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
  return (
    <Alert variant="destructive">
      <AlertTitle>
        <div className="flex gap-2 text-red-500">
          <BsExclamationCircle className="mt-0.5" />
          <div>
            <div className="font-medium">Poll Confidence: Low</div>
            <Body2>
              The results of your poll are not conclusive. We recommend you run
              the same poll to a larger sample of residents.
            </Body2>
          </div>
        </div>
      </AlertTitle>
    </Alert>
  )
}
