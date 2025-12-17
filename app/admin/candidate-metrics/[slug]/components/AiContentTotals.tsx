'use client'

import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import { dateUsHelper } from 'helpers/dateHelper'
import { numberFormatter } from 'helpers/numberHelper'
import { Fragment } from 'react'

interface Campaign {
  aiContent?: PrismaJson.CampaignAiContent
}

interface AiContentTotalsProps {
  campaign: Campaign
}

export default function AiContentTotals(props: AiContentTotalsProps): React.JSX.Element {
  const { campaign } = props
  const { aiContent } = campaign
  if (!aiContent) {
    return <div className="my-4 text-xl">No AI Content</div>
  }
  const total = Object.keys(aiContent).length
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
        {Object.keys(aiContent).map((key) => (
          <Fragment key={key}>
            <div className=" col-span-6">{aiContent[key]?.name}</div>
            <div className=" col-span-6">
              updated at: {aiContent[key]?.updatedAt ? dateUsHelper(aiContent[key].updatedAt) : ''}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
