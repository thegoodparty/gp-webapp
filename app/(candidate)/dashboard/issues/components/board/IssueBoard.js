'use client'
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core'
import { useState } from 'react'
import { useIssues } from '@shared/hooks/useIssues'
import BoardColumn from './BoardColumn'
import IssueCard from './IssueCard'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import {
  BOARD_COLUMNS,
  COLUMN_TO_STATUS_MAP,
  getColumnTypeFromStatus,
} from '../../shared/constants'

const updateIssueStatus = async (issueId, status) => {
  const resp = await clientFetch(apiRoutes.issues.update, {
    id: issueId,
    status,
  })
}

export default function IssueBoard() {
  const [issues, setIssues] = useIssues()
  const [activeIssue, setActiveIssue] = useState(null)

  const handleDragStart = (event) => {
    const { active } = event
    const issue = active.data.current?.issue
    if (issue) {
      setActiveIssue(issue)
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveIssue(null)

    if (!over) return

    const draggedIssue = active.data.current?.issue
    const targetColumn = over.id

    if (!draggedIssue || !targetColumn) return

    // Check if the issue is being moved to a different column
    const currentColumnType = getColumnTypeFromStatus(draggedIssue.status)
    if (currentColumnType === targetColumn) return

    // Get the new status based on the target column
    const newStatus = COLUMN_TO_STATUS_MAP[targetColumn]
    if (!newStatus) return

    // Update the issue status locally
    const updatedIssues = issues.map((issue) =>
      issue.id === draggedIssue.id ? { ...issue, status: newStatus } : issue,
    )

    setIssues(updatedIssues)

    await updateIssueStatus(draggedIssue.id, newStatus)
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
        <BoardColumn type={BOARD_COLUMNS.ACCEPTED} issues={issues} />
        <BoardColumn type={BOARD_COLUMNS.IN_PROGRESS} issues={issues} />
        <BoardColumn type={BOARD_COLUMNS.COMPLETED} issues={issues} />
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
