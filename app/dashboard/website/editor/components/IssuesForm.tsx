import { useEffect, useState } from 'react'
import Button from '@shared/buttons/Button'
import TextField from '@shared/inputs/TextField'
import Label from './Label'
import { LuPlus, LuPencil } from 'react-icons/lu'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import { FilledErrorAlert } from '@shared/alerts/FilledErrorAlert'
import { WebsiteIssue } from 'helpers/types'

interface IssueFormErrors {
  title?: string
  description?: string
  alert?: string
}

const MIN_POLICY_FOCUS_LENGTH = 50

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
  const [editingIssueIndex, setEditingIssueIndex] = useState<number | null>(
    null,
  )
  const [formErrors, setFormErrors] = useState<IssueFormErrors>({})

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
    setFormErrors({})
  }

  const handleOpenEditDialog = (issue: WebsiteIssue, index: number) => {
    setEditingIssue({ ...issue })
    setEditingIssueIndex(index)
    setFormErrors({})
  }

  const handleCloseEditDialog = () => {
    setEditingIssue(null)
    setEditingIssueIndex(null)
    setFormErrors({})
  }

  const validateIssue = (issue: WebsiteIssue): IssueFormErrors => {
    const errors: IssueFormErrors = {}
    const hasTitle = issue.title.trim().length > 0
    const hasDescription =
      issue.description.trim().length >= MIN_POLICY_FOCUS_LENGTH

    if (!hasTitle && !hasDescription) {
      errors.alert = 'Please add Issue Title and Policy Focus'
      errors.title = 'Issue Title is required'
      errors.description = `Your Policy Focus must have at least ${MIN_POLICY_FOCUS_LENGTH} characters`
    } else if (!hasTitle) {
      errors.alert = 'Please add Issue Title'
      errors.title = 'Issue Title is required'
    } else if (!hasDescription) {
      errors.alert = 'Please add Policy Focus'
      errors.description = `Your Policy Focus must have at least ${MIN_POLICY_FOCUS_LENGTH} characters`
    }

    return errors
  }

  const handleSaveIssue = () => {
    if (editingIssueIndex !== null && editingIssue) {
      const errors = validateIssue(editingIssue)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }
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

  const handleTitleChange = (value: string) => {
    setEditingIssue((prev) =>
      prev ? { ...prev, title: value } : { title: value, description: '' },
    )
    if (formErrors.title && value.trim().length > 0) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next.title
        next.alert = prev.description ? 'Please add Policy Focus' : undefined
        if (!next.alert) delete next.alert
        return next
      })
    }
  }

  const handleDescriptionChange = (value: string) => {
    setEditingIssue((prev) =>
      prev
        ? { ...prev, description: value }
        : { title: '', description: value },
    )
    if (
      formErrors.description &&
      value.trim().length >= MIN_POLICY_FOCUS_LENGTH
    ) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next.description
        next.alert = prev.title ? 'Please add Issue Title' : undefined
        if (!next.alert) delete next.alert
        return next
      })
    }
  }

  const descriptionLength = editingIssue?.description.trim().length ?? 0

  return (
    <div className="mt-4">
      <Label className="mb-2">
        Key Issues <sup>*</sup>
      </Label>
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
        {formErrors.alert && (
          <FilledErrorAlert className="mb-6">
            {formErrors.alert}
          </FilledErrorAlert>
        )}
        <Label>
          Issue Title <sup>*</sup>
        </Label>
        <TextField
          fullWidth
          required
          value={editingIssue?.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={!!formErrors.title}
          helperText={formErrors.title}
        />
        <Label className="mt-6">
          Policy Focus <sup>*</sup>
        </Label>
        <TextField
          fullWidth
          required
          multiline
          rows={3}
          value={editingIssue?.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={!!formErrors.description}
          helperText={
            <span
              className={`flex justify-between ${
                formErrors.description ? '' : 'text-gray-500'
              }`}
            >
              <span>
                Your Policy Focus must have at least {MIN_POLICY_FOCUS_LENGTH}{' '}
                characters
              </span>
              <span>{descriptionLength}</span>
            </span>
          }
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
