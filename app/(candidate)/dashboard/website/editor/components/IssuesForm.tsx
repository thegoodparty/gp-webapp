import { useEffect, useState } from 'react'
import Button from '@shared/buttons/Button'
import TextField from '@shared/inputs/TextField'
import Label from './Label'
import { LuPlus, LuPencil } from 'react-icons/lu'
import ResponsiveModal from '@shared/utils/ResponsiveModal'

interface WebsiteIssue {
  title: string
  description: string
}

interface IssuesFormProps {
  issues?: WebsiteIssue[]
  onChange: (issues: WebsiteIssue[]) => void
  initialIssues?: WebsiteIssue[]
}

export default function IssuesForm({
  issues: websiteIssues = [],
  onChange,
  initialIssues, // top issues and custom issues from the campaign
}: IssuesFormProps) {
  const [editingIssue, setEditingIssue] = useState<WebsiteIssue | null>(null)
  const [editingIssueIndex, setEditingIssueIndex] = useState<number | null>(null)

  const currentIssues =
    websiteIssues.length > 0 ? websiteIssues : initialIssues || []

  useEffect(() => {
    if (
      websiteIssues.length === 0 &&
      initialIssues &&
      initialIssues.length > 0
    ) {
      onChange(initialIssues)
    }
  }, [initialIssues, websiteIssues])

  const handleAddIssue = () => {
    setEditingIssue({ title: '', description: '' })
    setEditingIssueIndex(currentIssues.length)
  }

  const handleOpenEditDialog = (issue: WebsiteIssue, index: number) => {
    setEditingIssue({ ...issue })
    setEditingIssueIndex(index)
  }

  const handleCloseEditDialog = () => {
    setEditingIssue(null)
    setEditingIssueIndex(null)
  }

  const handleSaveIssue = () => {
    if (editingIssueIndex !== null && editingIssue) {
      const newIssues = [...currentIssues]
      newIssues[editingIssueIndex] = editingIssue
      onChange(newIssues)
      handleCloseEditDialog()
    }
  }

  const handleDeleteIssue = () => {
    const newIssues = currentIssues.filter(
      (_, index) => index !== editingIssueIndex,
    )
    onChange(newIssues)
    handleCloseEditDialog()
  }

  return (
    <div className="mt-4">
      <Label className="mb-2">Key Issues</Label>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {currentIssues?.map((issue, index) => (
          <Button
            key={index}
            variant="outlined"
            size="large"
            color="neutral"
            className="w-full [&>span]:text-left !p-4 !py-3 !border-[1px] !border-black/[0.12]"
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
          className="flex items-center w-full !p-4 !py-3 !border-[1px] !border-black/[0.12]"
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
            setEditingIssue((prev) => prev ? { ...prev, title: e.target.value } : { title: e.target.value, description: '' })
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
            setEditingIssue((prev) => prev ? { ...prev, description: e.target.value } : { title: '', description: e.target.value })
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
