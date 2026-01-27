'use client'

import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import { dateUsHelper } from 'helpers/dateHelper'
import { numberFormatter } from 'helpers/numberHelper'
import { Fragment } from 'react'
import { AiContentData, Campaign, CampaignAiContent } from 'helpers/types'

interface AiContentTotalsProps {
  campaign: Campaign
}

export default function AiContentTotals(props: AiContentTotalsProps): React.JSX.Element {
  const { campaign } = props
  const { aiContent } = campaign
  if (!aiContent) {
    return <div className="my-4 text-xl">No AI Content</div>
  }
  const isAiContentData = (
    value: CampaignAiContent[string],
  ): value is AiContentData =>
    Boolean(
      value &&
        typeof value === 'object' &&
        'name' in value &&
        'content' in value &&
        'updatedAt' in value,
    )
  const entries = Object.entries(aiContent).filter(
    (entry): entry is [string, AiContentData] =>
      isAiContentData(entry[1]),
  )
  const total = entries.length
  return (
    <div className="">
      <div className="relative bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-blue-800 h-48 rounded-lg flex items-center justify-center flex-col text-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <H2 className="text-white">
          Total AI Items:
          <br />
          <div className=" text-6xl mt-3">{numberFormatter(total)}</div>
        </H2>
      </div>
      <H3 className="mt-4">Items Created:</H3>
      <div className="mt-2 grid grid-cols-12 gap-3">
        {entries.map(([key, value]) => (
          <Fragment key={key}>
            <div className=" col-span-6">{value.name}</div>
            <div className=" col-span-6">
              updated at: {value.updatedAt ? dateUsHelper(value.updatedAt) : ''}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
