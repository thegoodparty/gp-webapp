'use client'
import IssueItemEditor from 'app/(candidate)/dashboard/questions/components/issues/IssueItemEditor'
import { useEffect, useState } from 'react'
import AddCustomIssue from './AddCustomIssue'
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import {
  deleteCandidatePosition,
  filterIssues,
  handleDeleteCustomIssue,
  saveCandidatePosition,
} from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils'
import { IssuesSearch } from './IssuesSearch'
import { IssuesSelectList } from './IssuesSelectList'
import { AddNewIssueTrigger } from './AddNewIssueTrigger'
import type {
  Campaign,
  CandidatePosition,
  CustomIssue,
  IssuePosition,
  TopIssue,
} from 'helpers/types'

export type IssueOption = TopIssue

export interface EditIssuePosition {
  id?: number
  type?: 'custom' | 'position'
  topIssue?: TopIssue
  position?: IssuePosition | string
  description?: string
  title?: string
}

interface IssuesListProps {
  nextCallback: () => void
  candidatePositions?: CandidatePosition[] | false | null
  editIssuePosition?: EditIssuePosition | false
  campaign: Campaign
  topIssues: IssueOption[]
  setEditIssuePosition?: (issue: EditIssuePosition | false | null) => void
  order?: number
}

const IssuesList = ({
  nextCallback,
  candidatePositions,
  editIssuePosition,
  campaign: incomingCampaign,
  topIssues,
  setEditIssuePosition = () => {},
}: IssuesListProps): React.JSX.Element => {
  const [campaign, setCampaign] = useState<Campaign>(incomingCampaign)
  const [filterValue, setFilterValue] = useState('')
  const [selectedIssue, setSelectedIssue] = useState<
    IssueOption | 'custom' | null | false
  >(null)
  const activeEditIssuePosition =
    typeof editIssuePosition === 'object' && editIssuePosition !== null
      ? editIssuePosition
      : null
  const editingCustomIssue = activeEditIssuePosition?.type === 'custom'
  const showSelectList = !selectedIssue

  useEffect(() => {
    if (activeEditIssuePosition) {
      const nextIssue =
        activeEditIssuePosition.type === 'custom'
          ? 'custom'
          : activeEditIssuePosition.topIssue || null
      setSelectedIssue(nextIssue)
    }
  }, [activeEditIssuePosition])

  const selectIssueCallback = (
    issue: IssueOption | 'custom' | null | false,
  ) => {
    setSelectedIssue(issue)
    setFilterValue('')
  }

  const updateCustomIssuesState = (customIssues: CustomIssue[]) =>
    setCampaign({
      ...campaign,
      details: {
        ...campaign.details,
        customIssues,
      },
    })

  const saveCallback = async (
    position: IssuePosition,
    issue: IssueOption,
    candidatePosition: string,
  ) => {
    // if candidate position already exists in this order, delete it
    activeEditIssuePosition?.id &&
      (await deleteCandidatePosition(activeEditIssuePosition.id, campaign.id))

    if (activeEditIssuePosition?.type === 'custom') {
      updateCustomIssuesState(
        await handleDeleteCustomIssue(
          {
            title: activeEditIssuePosition.title!,
            position:
              typeof activeEditIssuePosition.position === 'string'
                ? activeEditIssuePosition.position
                : '',
          },
          campaign,
        ),
      )
    }
    await saveCandidatePosition({
      description: candidatePosition,
      campaignId: campaign.id,
      positionId: position.id,
      topIssueId: issue.id!,
    })
    nextCallback()
  }

  const handleSaveCustom = async () => {
    // if candidate position already exists in this order, delete it
    if (activeEditIssuePosition?.id) {
      await deleteCandidatePosition(activeEditIssuePosition.id, campaign.id)
    }
    const updatedCampaign = await getCampaign()
    if (updatedCampaign) {
      setCampaign(updatedCampaign)
    }

    nextCallback()
  }

  const filteredIssues = filterIssues(filterValue, topIssues)

  return (
    <div className=" max-w-3xl mx-auto">
      {!editingCustomIssue && !selectedIssue && (
        <div className="pt-4 pb-2">
          <IssuesSearch
            {...{
              issues: filteredIssues,
              onInputChange: setFilterValue,
            }}
          />
        </div>
      )}

      {showSelectList && (
        <>
          <IssuesSelectList
            issues={filteredIssues}
            handleSelectIssue={selectIssueCallback}
          />
          <AddNewIssueTrigger onClick={() => setSelectedIssue('custom')} />
        </>
      )}

      {selectedIssue &&
        (selectedIssue === 'custom' ? (
          <AddCustomIssue
            campaign={campaign}
            selectIssueCallback={selectIssueCallback}
            saveCallback={handleSaveCustom}
            editIssuePosition={editIssuePosition ?? null}
            setEditIssuePosition={setEditIssuePosition}
          />
        ) : (
          <IssueItemEditor
            issue={filteredIssues.find(
              ({ id: issueId }) => issueId === selectedIssue.id,
            )}
            selectIssueCallback={selectIssueCallback}
            saveCallback={saveCallback}
            candidatePositions={candidatePositions}
            editIssuePosition={editIssuePosition ?? null}
            setEditIssuePosition={setEditIssuePosition}
          />
        ))}
    </div>
  )
}

export default IssuesList
