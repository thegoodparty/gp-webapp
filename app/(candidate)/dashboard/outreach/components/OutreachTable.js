import { OUTREACH_TYPE_MAPPING } from 'app/(candidate)/dashboard/outreach/consts'
import { dateWithTime } from 'helpers/dateHelper'
import SimpleTable from '@shared/utils/SimpleTable'
import React from 'react'
import H4 from '@shared/typography/H4'
import { GradientOverlay } from '@shared/GradientOverlay'
import { formatAudienceLabels } from 'app/(candidate)/dashboard/outreach/util/formatAudienceLabels.util'
import Chip from '@shared/utils/Chip'

const VoterFileFilterChip = ({ label }) => <Chip
  {...{
    className: `
      px-2
      py-1
      rounded-full
      border
      border-gray-200
      bg-gray-100
      text-black
      font-normal
      flex
      items-center
      justify-center
    `,
    label,
    variant: 'outlined',
  }} />

export const OutreachTable = ({
  title = 'Your campaigns',
  outreaches,
  gradient = false,
}) => {
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
        const audienceLabels = formatAudienceLabels(row.voterFileFilter)
        return (
          <span>
            {audienceLabels.slice(0, 3).map((label, index) => (
              <VoterFileFilterChip key={index} label={label} />
            ))}
            {audienceLabels.length && ` (${audienceLabels.length})`}
          </span>
        )
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

  const table = <SimpleTable columns={columns} data={outreaches} />

  return (
    <section className="mt-4">
      <H4 className="mb-4">{title}</H4>
      {gradient ? <GradientOverlay>{table}</GradientOverlay> : table}
    </section>
  )
}
