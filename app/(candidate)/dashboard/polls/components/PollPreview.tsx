import TextMessagePreview from '@shared/text-message-previews/TextMessagePreview'
import { MessageCard } from 'app/polls/onboarding/components/MessageCard'
import { formatCurrency, numberFormatter } from 'helpers/numberHelper'
import React from 'react'
import { pollEstimatedCompletionDate } from '../shared/poll-utils'
import { PRICE_PER_POLL_TEXT } from '../shared/constants'
import Image from 'next/image'

export type PollPreviewProps = {
  scheduledDate: Date
  targetAudienceSize: number
  imageUrl: string | undefined
  message: string
  isFree: boolean
}

export const PollPreview: React.FC<PollPreviewProps> = ({
  scheduledDate,
  targetAudienceSize,
  imageUrl,
  message,
  isFree,
}) => {
  const estimatedCompletionDate = pollEstimatedCompletionDate(scheduledDate)
  return (
    <>
      <MessageCard
        className="mb-6"
        title="Outreach Summary"
        description={
          <div className="flex flex-col gap-1 mt-2">
            <p>
              Audience: <b>{numberFormatter(targetAudienceSize)}</b>
            </p>
            <p>
              Send Date: <b>{scheduledDate.toDateString()} at 11:00am</b>
            </p>
            <p>
              Estimated Completion:{' '}
              <b>{estimatedCompletionDate.toDateString()} at 11:00am</b>
            </p>
            <p>
              Cost:{' '}
              <b>
                {isFree
                  ? 'FREE'
                  : `$${formatCurrency(
                      PRICE_PER_POLL_TEXT * targetAudienceSize,
                    )}`}
              </b>
            </p>
          </div>
        }
        note="You can add more recipients after launch."
      />

      <MessageCard
        title="Preview"
        description={
          <div className="flex flex-col gap-1">
            <div className="max-w-xs mx-auto">
              <TextMessagePreview
                message={
                  <div className="flex flex-col gap-2">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Campaign image"
                        width={300}
                        height={300}
                        className="object-cover rounded"
                      />
                    ) : (
                      <Image
                        src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                        alt=""
                        width={300}
                        height={300}
                      />
                    )}
                    <p className="mt-1 font-normal">{message}</p>
                  </div>
                }
              />
            </div>
          </div>
        }
      />
    </>
  )
}
