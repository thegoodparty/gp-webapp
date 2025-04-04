'use client'

import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import Overline from '@shared/typography/Overline'
import Paper from '@shared/utils/Paper'
import Link from 'next/link'
import { IoArrowForward } from 'react-icons/io5'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

export default function ScriptCard({ type }) {
  let typeText = ''
  if (type === 'sms') {
    typeText = 'text'
  }
  if (type === 'telemarketing') {
    typeText = 'phone banking'
  }

  if (type === 'doorknocking') {
    typeText = 'door-knocking'
  }

  if (type === 'digitalads') {
    typeText = 'digital advertising'
  }
  return (
    <Paper className="h-full flex flex-col justify-between">
      <div>
        <H3>Create a script</H3>
        <Overline className="text-gray-600 mb-4">Tools</Overline>
        <Body2>
          Use GoodParty.org&apos;s content builder to write a {typeText} script.
          When you are done, you can attach that script to this campaign.
        </Body2>
      </div>
      <Link
        href="/dashboard/content?showModal=true"
        onClick={() => {
          trackEvent(
            EVENTS.VoterData.FileDetail.LearnTakeAction.ClickWriteScript,
            { type },
          )
        }}
      >
        <div className="mt-4 flex items-center justify-end">
          <div className="mr-2">Write Script</div>
          <IoArrowForward />
        </div>
      </Link>
    </Paper>
  )
}
