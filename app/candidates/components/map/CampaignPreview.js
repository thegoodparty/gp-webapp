'use client'

import { memo } from 'react'
import { IoClose } from 'react-icons/io5'
import {
  MdBeenhere,
  MdCalendarMonth,
  MdGroupWork,
  MdLocationOn,
  MdWorkHistory,
} from 'react-icons/md'

import Image from 'next/image'
import MarketingH5 from '@shared/typography/MarketingH5'
import Body1 from '@shared/typography/Body1'
import { dateUsHelper } from 'helpers/dateHelper'
import slugify from 'slugify'
import Link from 'next/link'

export default memo(function CampaignPreview({
  selectedCampaign,
  onSelectCampaign,
}) {
  if (!selectedCampaign) {
    return null
  }

  const {
    party,
    firstName,
    lastName,
    office,
    city,
    county,
    state,
    avatar,
    electionDate,
    didWin,
    data: { hubSpotUpdates } = {},
  } = selectedCampaign

  const primaryResults = hubSpotUpdates?.primary_election_result
    ? /won/i.test(hubSpotUpdates?.primary_election_result)
    : null
  const electionResults = hubSpotUpdates?.election_results
    ? /won/i.test(hubSpotUpdates?.election_results)
    : didWin

  const candidateName = `${firstName} ${lastName}`

  return (
    <div className="absolute top-0 p-4 md:p-0 left-4 w-[calc(100vw-32px)]   md:left-[416px] lg:left-[516px] md:w-[320px]   md:shadow md:mt-4  rounded-2xl z-50">
      <div className="h-full bg-white p-4 rounded-2xl shadow-md md:shadow-none">
        <div className="flex justify-end">
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              onSelectCampaign(false)
            }}
          >
            <IoClose size={24} />
          </div>
        </div>
        <div className="flex justify-between">
          {avatar && (
            <div className="inline-block border border-primary rounded-2xl relative w-28 h-28">
              <Image
                src={avatar}
                fill
                alt={candidateName}
                priority
                unoptimized
                className="rounded-2xl w-28 h-28 object-cover object-center"
              />
            </div>
          )}
        </div>
        <Link href={`/candidate/${slugify(candidateName.toLowerCase())}/${slugify(office.toLowerCase())}`}>
          <MarketingH5 className="mb-4">
            {candidateName}
          </MarketingH5>
        </Link>
        {office && (
          <div className="flex mb-3 items-center">
            <MdWorkHistory size={20} className="text-primary-light" />
            <Body1 className="ml-2 gray-600">{office}</Body1>
          </div>
        )}
        {state && (
          <div className="flex mb-3 items-center">
            <MdLocationOn size={20} className="text-primary-light" />
            <Body1 className="ml-2 gray-600">
              {city ? `${city}, ` : ''}
              {county ? `${county}, ` : ''}
              {state}
            </Body1>
          </div>
        )}
        {party && (
          <div className="flex mb-3 items-center">
            <MdGroupWork size={20} className="text-primary-light" />
            <Body1 className="ml-2 gray-600">{party}</Body1>
          </div>
        )}
        {electionDate && (
          <div className="flex mb-3 items-center">
            <MdCalendarMonth size={20} className="text-primary-light" />
            <Body1 className="ml-2 gray-600">
              Election Day: {dateUsHelper(electionDate)}
            </Body1>
          </div>
        )}
        {primaryResults && (
          <div className="flex mb-3 items-center">
            <MdBeenhere size={20} className="text-primary-light" />
            <Body1 className="ml-2 gray-600">
              Primary Election Result: {primaryResults ? 'Winner' : 'Lost'}
            </Body1>
          </div>
        )}
        <div className="flex mb-3 items-center">
          <MdBeenhere size={20} className="text-primary-light" />
          <Body1 className="ml-2 gray-600">
            Election Result:&nbsp;
            {typeof electionResults === 'boolean'
              ? electionResults
                ? 'Winner'
                : 'Lost'
              : 'Upcoming'}
          </Body1>
        </div>
      </div>
    </div>
  )
})
