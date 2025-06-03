import { OUTREACH_TYPE_MAPPING } from 'app/(candidate)/dashboard/outreach/consts'
import { dateWithTime } from 'helpers/dateHelper'
import SimpleTable from '@shared/utils/SimpleTable'
import React from 'react'
import H4 from '@shared/typography/H4'
import { GradientOverlay } from '@shared/GradientOverlay'
import { StackedChips } from '@shared/utils/StackedChips'
import { formatAudienceLabels } from 'app/(candidate)/dashboard/outreach/util/formatAudienceLabels.util'

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
        const atMostThreeLabels = audienceLabels.slice(0, 3)
        return !audienceLabels?.length ? (
          <span className="text-gray-500">n/a</span>
        ) : (
          <span className="flex flex-row items-center relative">
            <StackedChips
              {...{
                labels: audienceLabels,
                onClick: (labels, e) => {
                  console.log('derp', labels, e)
                },
              }}
            />
            {audienceLabels.length && (
              <span
                className="relative ml-2"
                style={{
                  left: `${(atMostThreeLabels.length - 1) * 0.25}rem`,
                }}
              >
                ({audienceLabels.length})
              </span>
            )}
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
