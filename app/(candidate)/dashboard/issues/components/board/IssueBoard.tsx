'use client'
import { DndContext, DragOverlay, closestCenter, DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { useState, useEffect } from 'react'
import { useIssues } from '@shared/hooks/useIssues'
import { Issue, IssueStatus } from '@shared/hooks/IssuesProvider'
import { useSearchFilters } from '@shared/hooks/useSearchFilters'
import BoardColumnComponent from './BoardColumn'
import IssueCard from './IssueCard'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import {
  BOARD_COLUMNS,
  COLUMN_TO_STATUS_MAP,
  getColumnTypeFromStatus,
  BoardColumn,
} from '../../shared/constants'

const VALID_BOARD_COLUMNS = new Set<string>(Object.values(BOARD_COLUMNS))
const isBoardColumn = (id: string | number): id is BoardColumn =>
  typeof id === 'string' && VALID_BOARD_COLUMNS.has(id)

const stringToIssueStatus = (status: string): IssueStatus | null => {
  const statusMap: Partial<Record<string, IssueStatus>> = {
    accepted: IssueStatus.accepted,
    inProgress: IssueStatus.inProgress,
    completed: IssueStatus.completed,
    wontDo: IssueStatus.wontDo,
    newIssue: IssueStatus.newIssue,
  }
  return statusMap[status] ?? null
}

const updateIssueStatus = async (uuid: string, status: string) => {
  await clientFetch(apiRoutes.issues.update, {
    uuid,
    status,
  })
}

export default function IssueBoard(): React.JSX.Element {
  const [allIssues, setAllIssues] = useIssues()
  const [_filters, _setFilters, filterItems] = useSearchFilters()
  const [issues, setIssues] = useState<Issue[]>(allIssues)
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null)

  useEffect(() => {
    setIssues(filterItems(allIssues))
  }, [allIssues, filterItems])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const issue = active.data.current?.issue
    if (issue) {
      setActiveIssue(issue)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveIssue(null)

    if (!over) return

    const draggedIssue = active.data.current?.issue
    const targetColumn = over.id

    if (!draggedIssue || !targetColumn) return
    if (!isBoardColumn(targetColumn)) return

    const currentColumnType = getColumnTypeFromStatus(draggedIssue.status)
    if (currentColumnType === targetColumn) return

    const statusString = COLUMN_TO_STATUS_MAP[targetColumn]
    if (!statusString) return

    const newStatus = stringToIssueStatus(statusString)
    if (!newStatus) return

    const updatedAllIssues = allIssues.map((issue: Issue) =>
      issue.uuid === draggedIssue.uuid
        ? { ...issue, status: newStatus }
        : issue,
    )

    setAllIssues(updatedAllIssues)

    await updateIssueStatus(draggedIssue.uuid, statusString)
  }

  const handleDragCancel = () => {
    setActiveIssue(null)
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between w-full">
        <BoardColumnComponent type={BOARD_COLUMNS.ACCEPTED} issues={issues} />
        <BoardColumnComponent type={BOARD_COLUMNS.IN_PROGRESS} issues={issues} />
        <BoardColumnComponent type={BOARD_COLUMNS.COMPLETED} issues={issues} />
      </div>

      <DragOverlay>
        {activeIssue ? (
          <div className="rotate-3 scale-105">
            <IssueCard issue={activeIssue} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
