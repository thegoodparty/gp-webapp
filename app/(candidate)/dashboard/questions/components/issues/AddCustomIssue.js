'use client'
import TextField from '@shared/inputs/TextField'
import { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import {
  findExistingCustomIssueIndex,
  writeCampaignCustomIssue,
} from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils'
import { IssueEditorButtons } from 'app/(candidate)/dashboard/questions/components/issues/IssueEditorButtons'

export default function AddCustomIssue({
  selectIssueCallback,
  saveCallback,
  campaign,
  editIssuePosition,
  setEditIssuePosition,
}) {
  const editingCustomIssue = editIssuePosition?.type === 'custom'

  const [existingIndex] = useState(
    findExistingCustomIssueIndex(
      campaign,
      editIssuePosition,
      selectIssueCallback,
    ),
  )

  const [title, setTitle] = useState(
    editingCustomIssue ? editIssuePosition.title : '',
  )
  const [position, setPosition] = useState(
    editingCustomIssue ? editIssuePosition.position : '',
  )
  const saveAllowed = title !== '' && position !== ''

  const handleAnotherIssue = () => {
    selectIssueCallback(false)
  }

  const handleSave = async () => {
    if (!saveAllowed) {
      return
    }
    const updatedCustomIssues = await writeCampaignCustomIssue(
      existingIndex,
      title,
      position,
      campaign.details.customIssues || [],
    )
    await saveCallback(updatedCustomIssues)
  }

  const onCancel = () => setEditIssuePosition(null)

  return (
    <>
      <div
        className="flex my-2 items-center font-medium text-sm cursor-pointer"
        onClick={handleAnotherIssue}
      >
        <FaChevronLeft />
        <div className="ml-2 ">Choose another issue</div>
      </div>
      <>
        <div className="mt-10">
          <TextField
            label="Name of issue"
            fullWidth
            value={title}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />
        </div>
        <div className="mt-10">
          <TextField
            label="Position on issue"
            placeholder="Write 1 or 2 sentences about your position on this issue..."
            fullWidth
            value={position}
            multiline
            rows={6}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setPosition(e.target.value)
            }}
          />
        </div>
        <div className="mt-10 flex justify-center">
          <IssueEditorButtons
            disableSave={!saveAllowed}
            editIssuePosition={editIssuePosition}
            onSave={handleSave}
            onCancel={onCancel}
          />
        </div>
      </>
    </>
  )
}
