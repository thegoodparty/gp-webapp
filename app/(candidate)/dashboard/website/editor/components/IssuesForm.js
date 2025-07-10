import { useState } from 'react'
import Button from '@shared/buttons/Button'
import TextField from '@shared/inputs/TextField'
import Label from './Label'
import { LuPlus, LuPencil } from 'react-icons/lu'
import ResponsiveModal from '@shared/utils/ResponsiveModal'

export default function IssuesForm({ issues = [], onChange }) {
  const [editingIssue, setEditingIssue] = useState(null)
  const [editingIssueIndex, setEditingIssueIndex] = useState(null)

  const handleAddIssue = () => {
    setEditingIssue({ title: '', description: '' })
    setEditingIssueIndex(issues.length)
  }

  const handleOpenEditDialog = (issue, index) => {
    setEditingIssue({ ...issue })
    setEditingIssueIndex(index)
  }

  const handleCloseEditDialog = () => {
    setEditingIssue(null)
    setEditingIssueIndex(null)
  }

  const handleSaveIssue = () => {
    if (editingIssueIndex !== null && editingIssue) {
      const newIssues = [...issues]
      newIssues[editingIssueIndex] = editingIssue
      onChange(newIssues)
      handleCloseEditDialog()
    }
  }

  const handleDeleteIssue = () => {
    const newIssues = issues.filter((_, index) => index !== editingIssueIndex)
    onChange(newIssues)
    handleCloseEditDialog()
  }

  return (
    <div className="mt-4">
      <Label>Key Issues</Label>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
        {issues?.map((issue, index) => (
          <Button
            key={index}
            variant="outlined"
            size="large"
            color="neutral"
            className="w-full mt-2 [&>span]:text-left !p-4 !py-3"
            onClick={() => handleOpenEditDialog(issue, index)}
          >
            <span className="flex justify-between w-full">
              {issue.title || 'New Issue'}
              <LuPencil className="text-black" size={16} />
            </span>
            <span className="block truncate w-full text-sm text-gray-500">
              {issue.description || 'Policy Focus'}
            </span>
          </Button>
        ))}
        <Button
          variant="outlined"
          size="large"
          color="neutral"
          onClick={handleAddIssue}
          className="flex items-center w-full mt-2 !p-4 !py-3"
        >
          Add issue
          <LuPlus className="ml-auto text-black" size={16} />
        </Button>
      </div>
      <ResponsiveModal
        title="Key Issue"
        open={editingIssue !== null}
        onClose={handleCloseEditDialog}
      >
        <Label>Issue Title</Label>
        <TextField
          fullWidth
          required
          value={editingIssue?.title || ''}
          onChange={(e) =>
            setEditingIssue((prev) => ({ ...prev, title: e.target.value }))
          }
          InputLabelProps={{ shrink: true }}
        />
        <Label className="mt-6">Policy Focus</Label>
        <TextField
          fullWidth
          required
          multiline
          rows={3}
          value={editingIssue?.description || ''}
          onChange={(e) =>
            setEditingIssue((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          InputLabelProps={{ shrink: true }}
        />
        <div className="flex justify-between mt-4">
          <Button size="large" variant="text" onClick={handleDeleteIssue}>
            Delete
          </Button>
          <Button size="large" onClick={handleSaveIssue}>
            Save
          </Button>
        </div>
      </ResponsiveModal>
    </div>
  )
}
