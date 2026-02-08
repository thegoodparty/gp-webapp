'use client'

import { BsExclamationCircle } from 'react-icons/bs'
import { Alert, AlertTitle, Button } from 'goodparty-styleguide'
import Body2 from '@shared/typography/Body2'
import { usePoll } from './hooks/PollProvider'
import Link from 'next/link'
import { dateUsHelper } from 'helpers/dateHelper'
import { isPollExpanding } from './poll-utils'
import { PollStatus } from './poll-types'
import { LuCircleCheck } from 'react-icons/lu'
import clsx from 'clsx'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { districtStatsQueryOptions } from './queries'

export default function ConfidenceAlert() {
  const queryClient = useQueryClient()
  const [poll] = usePoll()
  const { lowConfidence } = poll

  // Prefetch the district stats query if the poll has low confidence. We're going to need
  // this to calculate the recommended poll size, and this _can_ be a slow query.
  useEffect(() => {
    if (lowConfidence) {
      queryClient.prefetchQuery(
        districtStatsQueryOptions({ hasCellPhone: 'true' }),
      )
    }
  }, [lowConfidence])

  if (isPollExpanding(poll)) {
    const alertData =
      poll.status === PollStatus.SCHEDULED
        ? {
            variant: 'success' as const,
            icon: <LuCircleCheck className="mt-0.5" />,
            color: 'text-green-500',
            message: `This poll is scheduled to gather more feedback on ${dateUsHelper(
              poll.scheduledDate,
            )} at 11:00 AM`,
          }
        : {
            variant: 'info' as const,
            icon: <BsExclamationCircle className="mt-0.5" />,
            color: 'text-blue-500',
            message: `Poll expansion is currently in progress. New results are expected on ${dateUsHelper(
              poll.estimatedCompletionDate,
            )} at 11:00 AM.`,
          }
    return (
      <Alert variant={alertData.variant}>
        <AlertTitle>
          <div className="flex flex-col gap-4 md:flex-row justify-between">
            <div className={clsx('flex gap-2', alertData.color)}>
              {alertData.icon}
              <div className="font-medium">{alertData.message}</div>
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
