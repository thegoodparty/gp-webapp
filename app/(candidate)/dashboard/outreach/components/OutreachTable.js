'use client'
import { OUTREACH_TYPE_MAPPING } from 'app/(candidate)/dashboard/outreach/constants'
import { dateWithTime } from 'helpers/dateHelper'
import SimpleTable from '@shared/utils/SimpleTable'
import { useMemo, useState } from 'react'
import H4 from '@shared/typography/H4'
import { GradientOverlay } from '@shared/GradientOverlay'
import { StackedChips } from '@shared/utils/StackedChips'
import { formatAudienceLabels } from 'app/(candidate)/dashboard/outreach/util/formatAudienceLabels.util'
import { ActualViewAudienceFiltersModal } from 'app/(candidate)/dashboard/voter-records/components/ViewAudienceFiltersModal'
import { convertAudienceFiltersForModal } from 'app/(candidate)/dashboard/outreach/util/convertAudienceFiltersForModal.util'
import Popover from '@mui/material/Popover'
import {
  OUTREACH_ACTION_TYPES,
  OutreachActions,
} from 'app/(candidate)/dashboard/outreach/components/OutreachActions'
import { useOutreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'

const NotApplicableLabel = () => <span className="text-gray-500">n/a</span>

export const OutreachTable = ({ mockOutreaches }) => {
  const [outreaches] = useOutreach()
  const useMockData = !outreaches?.length
  const tableData = useMockData ? mockOutreaches : outreaches
  const [viewFilters, setViewFilters] = useState(null)
  const [actOnOutreach, setActOnOutreach] = useState(null)
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
  })
  const title = useMockData ? 'How your outreach could look' : 'Your campaigns'
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
        const audienceLabels = formatAudienceLabels(row.voterFileFilter || {})
        const atMostThreeLabels = audienceLabels.slice(0, 3)
        return !audienceLabels?.length ? (
          <NotApplicableLabel />
        ) : (
          <span className="flex flex-row items-center relative">
            <StackedChips
              {...{
                labels: audienceLabels,
                onClick: (labels, e) => {
                  e.stopPropagation()
                  setViewFilters(row.voterFileFilter)
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
      cell: ({ row }) =>
        row.voterFileFilter?.voterCount || <NotApplicableLabel />,
    },
  ]

  const convertedFilters = useMemo(
    () => viewFilters && convertAudienceFiltersForModal(viewFilters),
    [viewFilters],
  )

  const handleRowClick = (outreach, { clientX, clientY } = {}) => {
    setActOnOutreach(outreach)
    setPopoverPosition({
      top: clientY + 10,
      left: clientX + 10,
    })
  }

  const handlePopoverClose = () => {
    setActOnOutreach(null)
    setPopoverPosition({ top: 0, left: 0 })
  }

  const handleCopyScript = (outreach) => {
    console.log('Copy script for outreach:', outreach)
    // TODO: Implement copy script logic here
  }

  const handleDownloadFilteredVoterFile = (outreach) => {
    console.log('Download filtered voter file for outreach:', outreach)
    // TODO: Implement download filtered voter file logic here
  }

  const actionHandlers = {
    [OUTREACH_ACTION_TYPES.COPY_SCRIPT]: handleCopyScript,
    [OUTREACH_ACTION_TYPES.DOWNLOAD_LIST]: handleDownloadFilteredVoterFile,
  }

  const handleActionClick = (outreach, actionType) => {
    actionHandlers[actionType] && actionHandlers[actionType](outreach)
    setActOnOutreach(null)
  }

  const table = (
    <SimpleTable
      columns={columns}
      data={tableData.sort((a, b) => new Date(a.date) - new Date(b.date))}
      onRowClick={handleRowClick}
    />
  )

  return (
    <section className="mt-4">
      <H4 className="mb-4">{title}</H4>
      {useMockData ? (
        <GradientOverlay>{table}</GradientOverlay>
      ) : (
        <>
          {table}
          <Popover
            open={Boolean(actOnOutreach)}
            onClose={handlePopoverClose}
            anchorReference="anchorPosition"
            anchorPosition={popoverPosition}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <OutreachActions
              {...{
                outreach: actOnOutreach,
                onClick: handleActionClick,
              }}
            />
          </Popover>
        </>
      )}
      <ActualViewAudienceFiltersModal
        {...{
          open: Boolean(viewFilters),
          audienceFilters: convertedFilters,
          onClose: () => setViewFilters(null),
          className: 'ml-1 self-center',
        }}
      />
    </section>
  )
}
