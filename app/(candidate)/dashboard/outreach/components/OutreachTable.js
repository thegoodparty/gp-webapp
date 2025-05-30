import { OUTREACH_TYPE_MAPPING } from 'app/(candidate)/dashboard/outreach/consts'
import { dateWithTime } from 'helpers/dateHelper'
import SimpleTable from '@shared/utils/SimpleTable'
import React from 'react'
import H4 from '@shared/typography/H4'

export const OutreachTable = ({ outreaches }) => {
  const columns = [
    {
      header: 'Channel',
      cell: ({ row }) => {
        const { outreachType } = row
        return outreachType
          ? OUTREACH_TYPE_MAPPING[outreachType] ||
              outreachType.charAt(0).toUpperCase() + outreachType.slice(1)
          : ''
      },
    },
    {
      header: 'Date',
      cell: ({ row }) => dateWithTime(row.date),
    },
    {
      header: 'Audience',
      cell: ({ row }) => {
        const {
          partyIndependent,
          partyDemocrat,
          partyRepublican,
          audienceSuperVoters,
          audienceLikelyVoters,
          audienceUnreliableVoters,
          audienceUnlikelyVoters,
          audienceFirstTimeVoters,
        } = row.voterFileFilter || {}
        const parties = []
        if (partyIndependent) parties.push('Independent')
        if (partyDemocrat) parties.push('Democrat')
        if (partyRepublican) parties.push('Republican')
        const audienceFields = [
          audienceSuperVoters,
          audienceLikelyVoters,
          audienceUnreliableVoters,
          audienceUnlikelyVoters,
          audienceFirstTimeVoters,
        ]
        const count = audienceFields.filter(Boolean).length
        return `${parties.join(', ')}${count ? ` (${count})` : ''}`
      },
    },
    {
      header: 'Voters',
      cell: ({ row }) => row.voterFileFilter.voterCount,
    },
    {
      header: 'Actions',
      cell: () => (
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>•••</span>
      ),
    },
  ]

  return (
    <section className="mt-4">
      <H4 className="mb-4">Your campaigns</H4>
      <SimpleTable columns={columns} data={outreaches} />
    </section>
  )
}
