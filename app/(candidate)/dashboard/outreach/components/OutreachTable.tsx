'use client'

import { OUTREACH_TYPE_MAPPING, OUTREACH_TYPES } from 'app/(candidate)/dashboard/outreach/constants'
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
import { useOutreach, Outreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useP2pUxEnabled } from 'app/(candidate)/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'

type FlexibleObject = { [key: string]: string | number | boolean | object | null | undefined }

const NotApplicableLabel = (): React.JSX.Element => (
  <span className="text-gray-500">n/a</span>
)

const STATUS_COLUMN = {
  header: 'Status',
  cell: ({ row }: { row: FlexibleObject }): React.JSX.Element => {
    if (row.outreachType !== OUTREACH_TYPES.p2p) {
      return <NotApplicableLabel />
    }

    const { p2pJob } = row as FlexibleObject & { p2pJob?: FlexibleObject }

    const statusLabels: Record<string, string> = {
      pending: 'Draft',
      approved: 'In review',
      denied: 'In review',
      paid: 'Scheduled',
      in_progress: 'Scheduled',
      completed: 'Sent',
    }

    if (!p2pJob?.status || !row.status || !statusLabels[row.status as string]) {
      return <NotApplicableLabel />
    }

    const showActiveStatus = (p2pJob?.status as string) === 'active'

    return (
      <span className="capitalize">
        {p2pJob && showActiveStatus
          ? statusLabels.completed
          : statusLabels[row.status as string]}
      </span>
    )
  },
}

export const OutreachTable = ({
  mockOutreaches,
}: {
  mockOutreaches: Outreach[]
}): React.JSX.Element => {
  const { p2pUxEnabled } = useP2pUxEnabled()
  const [outreaches] = useOutreach()
  const useMockData = !outreaches?.length
  const tableData: (Outreach | FlexibleObject)[] = useMockData
    ? mockOutreaches
    : outreaches
  const [viewFilters, setViewFilters] = useState<FlexibleObject | null>(null)
  const [actOnOutreach, setActOnOutreach] = useState<FlexibleObject | null>(
    null,
  )
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
  })
  const title = useMockData ? 'How your outreach could look' : 'Your campaigns'

  const TYPE_LABELS = OUTREACH_TYPE_MAPPING as Record<string, string>

  const columns: Array<{
    header: string
    accessorKey?: string
    cell?: ({ row }: { row: FlexibleObject }) => React.ReactNode
  }> = [
    {
      header: 'Date',
      cell: ({ row }: { row: FlexibleObject }) =>
        row.date ? (
          dateUsHelper(String(row.date), 'long')
        ) : (
          <NotApplicableLabel />
        ),
    },
    {
      header: 'Channel',
      cell: ({ row }: { row: FlexibleObject }) => {
        const outreachType = String(row.outreachType || '')
        return outreachType
          ? TYPE_LABELS[outreachType] ||
              outreachType.charAt(0).toUpperCase() + outreachType.slice(1)
          : ''
      },
    },
    {
      header: 'Audience',
      cell: ({ row }: { row: FlexibleObject }) => {
        const audienceLabels = formatAudienceLabels(
          (row.voterFileFilter as FlexibleObject) || ({} as FlexibleObject),
        )
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
                  setViewFilters((row.voterFileFilter as FlexibleObject) || {})
                },
              }}
            />
            {audienceLabels.length ? (
              <span
                className="relative ml-2"
                style={{
                  left: `${(atMostThreeLabels.length - 1) * 0.25}rem`,
                }}
              >
                ({audienceLabels.length})
              </span>
            ) : null}
          </span>
        )
      },
    },
    {
      header: 'Voters',
      cell: ({ row }: { row: FlexibleObject }) =>
        (row.voterFileFilter as FlexibleObject)?.voterCount !== undefined ||
        ['0', 0].includes(
          (row.voterFileFilter as FlexibleObject)?.voterCount as
            | string
            | number,
        ) ? (
          Number(
            (row.voterFileFilter as FlexibleObject)?.voterCount as
              | string
              | number,
          ).toLocaleString()
        ) : (
          <NotApplicableLabel />
        ),
    },
    ...(p2pUxEnabled ? [STATUS_COLUMN] : []),
  ]

  const convertedFilters = useMemo(
    () => viewFilters && convertAudienceFiltersForModal(viewFilters),
    [viewFilters],
  )

  const handleRowClick = (
    outreach: FlexibleObject,
    { clientX, clientY }: { clientX: number; clientY: number } = {
      clientX: 0,
      clientY: 0,
    },
  ) => {
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

  const handleActionClick = (action: string) => {
    if (!actOnOutreach) return
    trackEvent(EVENTS.Outreach.ActionClicked, {
      outreachId: String((actOnOutreach as FlexibleObject).id ?? ''),
      medium: String((actOnOutreach as FlexibleObject).outreachType ?? ''),
      action,
    })
    setActOnOutreach(null)
  }

  // Sort table data by date, placing entries without a date at the end
  const sortedTableData = useMemo(
    () =>
      [...tableData].sort((a: FlexibleObject, b: FlexibleObject) =>
        !a.date && !b.date
          ? 0
          : !a.date
          ? 1
          : !b.date
          ? -1
          : new Date(String(a.date)).getTime() - new Date(String(b.date)).getTime(),
      ),
    [tableData],
  )

  const table = (
    <SimpleTable<FlexibleObject>
      columns={columns}
      data={sortedTableData as FlexibleObject[]}
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
                outreach: actOnOutreach as object,
                onClick: handleActionClick,
              }}
            />
          </Popover>
        </>
      )}
      <ActualViewAudienceFiltersModal
        {...{
          open: Boolean(convertedFilters),
          onClose: () => setViewFilters(null),
          voterFileFilter: convertedFilters as object,
        }}
      />
    </section>
  )
}

export default OutreachTable
