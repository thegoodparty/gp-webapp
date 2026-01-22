'use client'
import { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { IssuePositionsList } from 'app/(candidate)/dashboard/questions/components/issues/IssuePositionsList'
import { IssueItemLabel } from 'app/(candidate)/dashboard/questions/components/issues/IssueItemLabel'
import { IssueEditorButtons } from 'app/(candidate)/dashboard/questions/components/issues/IssueEditorButtons'
import { CandidatePositionStatement } from 'app/(candidate)/dashboard/questions/components/issues/CandidatePositionStatement'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import type { ComponentProps } from 'react'
import type { EditIssuePosition, IssueOption } from './IssuesList'
import type { CandidatePosition } from 'helpers/types'

type IssuePositionData =
  ComponentProps<typeof IssuePositionsList>['positions'][number]

interface IssueItemEditorProps {
  issue?: IssueOption
  selectIssueCallback?: (issue: IssueOption | null) => void
  saveCallback?: (
    position: IssuePositionData,
    issue: IssueOption,
    candidatePosition: string,
  ) => void
  editIssuePosition?: EditIssuePosition | false | null
  setEditIssuePosition?: (issue: EditIssuePosition | false | null) => void
  candidatePositions?: CandidatePosition[] | false | null
}

const IssueItemEditor = ({
  issue,
  selectIssueCallback = () => {},
  saveCallback = () => {},
  editIssuePosition,
  setEditIssuePosition = () => {},
}: IssueItemEditorProps): React.JSX.Element | null => {
  const [selectedPosition, setSelectedPosition] =
    useState<IssuePositionData | null>(null)
  const [candidatePosition, setCandidatePosition] = useState('')
  const saveAllowed = candidatePosition !== '' && selectedPosition

  useEffect(() => {
    if (
      typeof editIssuePosition === 'object' &&
      editIssuePosition !== null &&
      editIssuePosition.topIssue?.id === issue?.id
    ) {
      if (typeof editIssuePosition.position === 'object') {
        setSelectedPosition(editIssuePosition.position)
      }
      setCandidatePosition(editIssuePosition.description!)
    }
  }, [editIssuePosition, issue?.id])

  if (!issue || issue.positions?.length === 0) {
    return null
  }
  const { name, positions } = issue

  const handleSelectPosition = (position: IssuePositionData) => {
    if (selectedPosition?.id === position.id) {
      setSelectedPosition(null)
    } else {
      setSelectedPosition(position)
    }
  }

  const handleSave = () => {
    if (!saveAllowed) {
      return
    }
    saveCallback(selectedPosition, issue, candidatePosition)
  }

  const handleAnotherIssue = () => {
    selectIssueCallback(null)
    setSelectedPosition(null)
    setCandidatePosition('')
  }

  const onCancel = () => {
    trackEvent(EVENTS.Profile.TopIssues.CancelEdit)
    setEditIssuePosition(null)
  }

  return (
      <>
        <div
          className="
            flex
            my-2
            items-center
            font-medium
            text-sm
            cursor-pointer
          "
          onClick={handleAnotherIssue}
        >
          <FaChevronLeft />
          <div className="ml-2 ">Choose another issue</div>
        </div>
        <div
          className="
            p-4
            rounded-lg
            mt-2
            bg-tertiary-light
          "
        >
          <IssueItemLabel name={name || ''} numPositions={positions?.length} />
        </div>
        <div>
          <div className="my-4 font-semibold">
            Select your positions on this issue
          </div>
          <IssuePositionsList
            positions={positions!}
            selectedPosition={selectedPosition}
            handleSelectPosition={handleSelectPosition}
          />
          <div className="mt-10">
            <CandidatePositionStatement
              candidatePosition={candidatePosition}
              setCandidatePosition={setCandidatePosition}
            />
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <IssueEditorButtons
            disableSave={!saveAllowed}
            editIssuePosition={Boolean(editIssuePosition)}
            onSave={handleSave}
            onCancel={onCancel}
          />
        </div>
      </>
  )
}

export default IssueItemEditor
