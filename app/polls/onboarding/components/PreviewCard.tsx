'use client'
import { MessageCard } from './MessageCard'
import TextMessagePreview from '@shared/text-message-previews/TextMessagePreview'
import Image from 'next/image'
import { LuCalendar } from 'react-icons/lu'
import { dateUsHelper } from 'helpers/dateHelper'
import { numberFormatter } from 'helpers/numberHelper'

interface PreviewCardProps {
  demoMessageText: string
  imageUrl: string | null
  estimatedCompletionDate: Date | null
  count: number
  timeline: string
  cost: string
}

export default function PreviewCard({
  demoMessageText,
  imageUrl,
  estimatedCompletionDate,
  count,
  timeline,
  cost,
}: PreviewCardProps) {
  return (
    <div className="w-full items-center flex flex-col gap-4 mt-8">
      <MessageCard
        title="Outreach Summary"
        description={
          <div className="flex flex-col gap-1">
            <ul className="mb-1">
              <li className="leading-normal medium text-sm">
                {numberFormatter(count)} Recipients
              </li>
              <li className="leading-normal medium text-sm">
                Timeline: {timeline}
              </li>
              <li className="leading-normal medium text-sm">
                Cost: <b>{cost}</b>
              </li>
            </ul>
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
                    <p className="mt-1 font-normal">{demoMessageText}</p>
                  </div>
                }
              />
            </div>
          </div>
        }
        note="You can add more recipients after launch."
      />
      <MessageCard
        title="Schedule"
        icon={<LuCalendar />}
        description={
          <div className="flex flex-col gap-1">
            <p className="mt-3 font-normal text-sm">
              Estimated Completion Date:
            </p>
            <p className="leading-normal font-semibold medium text-sm">
              {estimatedCompletionDate
                ? `${dateUsHelper(estimatedCompletionDate, 'long')} 11:00 AM`
                : 'N/A'}
            </p>
            <div className="mt-2 pt-2 border-t border-muted-background" />
            <p className="leading-normal text-muted-foreground text-xs font-normal">
              Polls scheduled midweek before lunch perform best. The selected
              day and time will yield the most responses.
            </p>
          </div>
        }
        note=""
      />
    </div>
  )
}
