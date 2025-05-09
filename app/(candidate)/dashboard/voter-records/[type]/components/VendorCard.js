'use client'

import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import Chip from '@shared/utils/Chip'
import Paper from '@shared/utils/Paper'
import Image from 'next/image'
import { IoArrowForward } from 'react-icons/io5'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

export default function VendorCard({
  logo,
  name,
  url,
  subTitle,
  description,
  label,
}) {
  return (
    <Paper className="h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <Image
            src={logo}
            alt={name}
            width={64}
            height={64}
            className="rounded-2xl"
          />
          {label && (
            <Chip className="bg-primary text-white uppercase" label={label} />
          )}
        </div>
        <H3 className="mt-4">{name}</H3>
        <Body2 className="text-gray-600 mt-1">{subTitle}</Body2>
        <Body2 className="mt-4">{description}</Body2>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={() => {
          trackEvent(
            EVENTS.VoterData.FileDetail.RecommendedPartners.ClickReadMore,
            {
              name,
              url,
            },
          )
        }}
      >
        <div className="mt-4 flex items-center justify-end">
          <div className="mr-2">Read More</div>
          <IoArrowForward />
        </div>
      </a>
    </Paper>
  )
}
