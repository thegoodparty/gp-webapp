'use client'
import { OUTREACH_TYPE_MAPPING } from 'app/(candidate)/dashboard/outreach/constants'
import { dateUsHelper } from 'helpers/dateHelper'
import SimpleTable from '@shared/utils/SimpleTable'
import { useMemo, useState } from 'react'
import H4 from '@shared/typography/H4'
import { GradientOverlay } from '@shared/GradientOverlay'
import { StackedChips } from '@shared/utils/StackedChips'
import { OUTREACH_TYPES } from 'app/(candidate)/dashboard/outreach/constants'
import { formatAudienceLabels } from 'app/(candidate)/dashboard/outreach/util/formatAudienceLabels.util'
import { ActualViewAudienceFiltersModal } from 'app/(candidate)/dashboard/voter-records/components/ViewAudienceFiltersModal'
import { convertAudienceFiltersForModal } from 'app/(candidate)/dashboard/outreach/util/convertAudienceFiltersForModal.util'
import Popover from '@mui/material/Popover'
import { OutreachActions } from 'app/(candidate)/dashboard/outreach/components/OutreachActions'
import { useOutreach, Outreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useP2pUxEnabled } from 'app/(candidate)/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'
import { VoterFileFilters } from 'helpers/types'

interface OutreachRow extends Outreach {
  p2pJob?: { status?: string }
  voterFileFilter?: VoterFileFilters
}

interface OutreachTableProps {
  mockOutreaches?: OutreachRow[]
}

interface PopoverPosition {
  top: number
  left: number
}

const NotApplicableLabel = () => <span className="text-gray-500">n/a</span>

type StatusKey = 'pending' | 'approved' | 'denied' | 'paid' | 'in_progress' | 'completed'

const statusLabels: { [K in StatusKey]: string } = {
  pending: 'Draft',
  approved: 'In review',
  denied: 'In review',
  paid: 'Scheduled',
  in_progress: 'Scheduled',
  completed: 'Sent',
}

const isStatusKey = (key: string | null | undefined): key is StatusKey => {
  return key !== null && key !== undefined && key in statusLabels
}

const STATUS_COLUMN = {
  header: 'Status',
  cell: ({ row }: { row: OutreachRow }) => {
    // Check if this is a P2P outreach by checking for phoneListId
    // (phoneListId indicates it was created via P2P flow, even if type is normalized to 'text')
    if (row.phoneListId == null) {
      return <NotApplicableLabel />
    }

    const { p2pJob } = row

    if (!p2pJob?.status || !row.status || !isStatusKey(row.status)) {
      return <NotApplicableLabel />
    }

    const showActiveStatus = p2pJob?.status === 'active'

    return (
      <span className="capitalize">
        {p2pJob && showActiveStatus
          ? statusLabels.completed
          : statusLabels[row.status]}
      </span>
    )
  },
}

export const OutreachTable = ({ mockOutreaches = [] }: OutreachTableProps) => {
  const { p2pUxEnabled } = useP2pUxEnabled()
  const [outreaches] = useOutreach()
  const useMockData = !outreaches?.length
  const tableData: OutreachRow[] = useMockData ? mockOutreaches : outreaches
  const [viewFilters, setViewFilters] = useState<VoterFileFilters | null>(null)
  const [actOnOutreach, setActOnOutreach] = useState<OutreachRow | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    top: 0,
    left: 0,
  })
  const title = useMockData ? 'How your outreach could look' : 'Your campaigns'

  const columns = [
    {
      header: 'Date',
      cell: ({ row }: { row: OutreachRow }) =>
        row.date ? dateUsHelper(row.date, 'long') : <NotApplicableLabel />,
    },
    {
      header: 'Channel',
      cell: ({ row }: { row: OutreachRow }) => {
        const { outreachType } = row
        return outreachType
          ? OUTREACH_TYPE_MAPPING[outreachType] ||
              outreachType.charAt(0).toUpperCase() + outreachType.slice(1)
          : ''
      },
    },
    {
      header: 'Audience',
      cell: ({ row }: { row: OutreachRow }) => {
        const audienceLabels = formatAudienceLabels(row.voterFileFilter || {})
        const atMostThreeLabels = audienceLabels.slice(0, 3)
        return !audienceLabels?.length ? (
          <NotApplicableLabel />
        ) : (
          <span className="flex flex-row items-center relative">
            <StackedChips
              {...{
                labels: audienceLabels,
                onClick: (_labels: string[], e: React.MouseEvent) => {
                  e.stopPropagation()
                  setViewFilters(row.voterFileFilter || null)
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
      cell: ({ row }: { row: OutreachRow }) => {
        const voterCount = row.voterFileFilter?.voterCount
        const hasVoterCount = voterCount !== undefined && voterCount !== null
        return hasVoterCount ? (
          Number(voterCount).toLocaleString()
        ) : (
          <NotApplicableLabel />
        )
      },
    },
    ...(p2pUxEnabled ? [STATUS_COLUMN] : []),
  ]

  const convertedFilters = useMemo(
    () => viewFilters && convertAudienceFiltersForModal(viewFilters),
    [viewFilters],
  )

  const handleRowClick = (outreach: OutreachRow, { clientX, clientY }: { clientX?: number; clientY?: number } = {}) => {
    setActOnOutreach(outreach)
    setPopoverPosition({
      top: (clientY || 0) + 10,
      left: (clientX || 0) + 10,
    })
  }

  const handlePopoverClose = () => {
    setActOnOutreach(null)
    setPopoverPosition({ top: 0, left: 0 })
  }

  const handleActionClick = (action: string) => {
    trackEvent(EVENTS.Outreach.ActionClicked, {
      outreachId: actOnOutreach?.id,
      medium: actOnOutreach?.outreachType,
      action,
    })
    setActOnOutreach(null)
  }

  // Sort table data by date, placing entries without a date at the end
  const sortedTableData = useMemo(
    () =>
      [...tableData].sort((a, b) =>
        !a.date && !b.date
          ? 0
          : !a.date
          ? 1
          : !b.date
          ? -1
          : new Date(a.date).getTime() - new Date(b.date).getTime(),
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
          {actOnOutreach && (
            <Popover
              open
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
          )}
        </>
      )}
      <ActualViewAudienceFiltersModal
        open={Boolean(viewFilters)}
        audienceFilters={convertedFilters ?? undefined}
        onClose={() => setViewFilters(null)}
      />
    </section>
  )
}
