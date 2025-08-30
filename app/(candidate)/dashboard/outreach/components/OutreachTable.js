'use client'
import { OUTREACH_TYPE_MAPPING } from 'app/(candidate)/dashboard/outreach/constants'
import { dateUsHelper } from 'helpers/dateHelper'
import SimpleTable from '@shared/utils/SimpleTable'
import { useMemo, useState } from 'react'
import H4 from '@shared/typography/H4'
import { GradientOverlay } from '@shared/GradientOverlay'
import { StackedChips } from '@shared/utils/StackedChips'
import { formatAudienceLabels } from 'app/(candidate)/dashboard/outreach/util/formatAudienceLabels.util'
import { ActualViewAudienceFiltersModal } from 'app/(candidate)/dashboard/voter-records/components/ViewAudienceFiltersModal'
import { convertAudienceFiltersForModal } from 'app/(candidate)/dashboard/outreach/util/convertAudienceFiltersForModal.util'
import Popover from '@mui/material/Popover'
import { OutreachActions } from 'app/(candidate)/dashboard/outreach/components/OutreachActions'
import { useOutreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

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
      header: 'Date',
      cell: ({ row }) =>
        row.date ? dateUsHelper(row.date, 'long') : <NotApplicableLabel />,
    },
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
        row.voterFileFilter?.voterCount ||
        ['0', 0].includes(row.voterFileFilter?.voterCount) ? (
          Number(row.voterFileFilter?.voterCount).toLocaleString()
        ) : (
          <NotApplicableLabel />
        ),
    },
    {
      header: 'Status',
      cell: ({ row }) => {
        if (row.outreachType !== 'text') {
          return <NotApplicableLabel />
        }
        
        const statusLabels = {
          pending: 'Draft',
          approved: 'In review',
          denied: 'In review',
          paid: 'Scheduled',
          in_progress: 'Scheduled',
          completed: 'Sent'
        }
        
        if (!row.status || !statusLabels[row.status]) {
          return <NotApplicableLabel />
        }
        
        return <span>{statusLabels[row.status]}</span>
      },
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

  const handleActionClick = (action) => {
    trackEvent(EVENTS.Outreach.ActionClicked, {
      outreachId: actOnOutreach.id,
      medium: actOnOutreach.outreachType,
      action,
    })
    setActOnOutreach(null)
  }

  // Sort table data by date, placing entries without a date at the end
  const sortedTableData = useMemo(
    () =>
      tableData.sort((a, b) =>
        !a.date && !b.date
          ? 0
          : !a.date
          ? 1
          : !b.date
          ? -1
          : new Date(a.date) - new Date(b.date),
      ),
    [tableData],
  )

  const table = (
    <SimpleTable
      columns={columns}
      data={sortedTableData}
      onRowClick={handleRowClick}
    />
  )

  return (
    <section className="mt-4 mb-32">
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
