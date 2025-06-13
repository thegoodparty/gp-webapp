import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { AddRounded, EditRounded, DeleteRounded } from '@mui/icons-material'
import Button from '@shared/buttons/Button'
import TextField from '@shared/inputs/TextField'

export default function IssuesForm({ issues = [], onChange }) {
  const [editingIssue, setEditingIssue] = useState(null)
  const [editingIssueIndex, setEditingIssueIndex] = useState(null)

  const handleAddIssue = () => {
    const newIssues = [...issues, { title: '', description: '' }]
    onChange(newIssues)
  }

  const handleRemoveIssue = (index) => {
    const newIssues = [...issues]
    newIssues.splice(index, 1)
    onChange(newIssues)
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Key Issues</h3>
        <Button
          variant="outlined"
          onClick={handleAddIssue}
          className="flex items-center gap-2 !rounded-full !px-6"
        >
          <AddRounded className="h-5 w-5" />
          Add Issue
        </Button>
      </div>

      <div className="space-y-3">
        {issues?.map((issue, index) => (
          <div
            key={index}
            className="p-4 bg-slate-50 rounded-xl flex items-start justify-between group"
          >
            <div>
              <h4 className="text-lg font-medium">
                {issue.title || 'New Issue'}
              </h4>
              <p className="text-gray-500">
                {issue.description || 'Policy Focus'}
              </p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleOpenEditDialog(issue, index)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-white"
              >
                <EditRounded className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveIssue(index)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-white"
              >
                <DeleteRounded className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        {(!issues || issues.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No issues added yet. Click &ldquo;Add Issue&rdquo; to get started.
          </div>
        )}
      </div>

      <Dialog
        open={editingIssue !== null}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Issue</DialogTitle>
        <DialogContent>
          <div className="mt-4 space-y-4">
            <TextField
              label="Issue Title"
              fullWidth
              required
              value={editingIssue?.title || ''}
              onChange={(e) =>
                setEditingIssue((prev) => ({ ...prev, title: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Policy Focus"
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleCloseEditDialog}>
            Cancel
          </Button>
          <Button onClick={handleSaveIssue}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
