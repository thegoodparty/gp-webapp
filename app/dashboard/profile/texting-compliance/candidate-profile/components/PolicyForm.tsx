'use client'
import {
  Alert,
  AlertDescription,
  Button,
  CircleAlertIcon,
  Input,
} from '@styleguide'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { WebsiteIssue } from 'helpers/types'
import {
  MIN_POLICY_FOCUS_LENGTH,
  getBioPlainLength,
  getPolicyFormValidation,
} from '../candidateProfile.utils'

const RichEditor = dynamic(() => import('app/shared/utils/RichEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border border-input bg-white px-3 py-2 text-sm text-muted-foreground">
      Loading editor…
    </div>
  ),
})

interface PolicyFormProps {
  initial?: WebsiteIssue
  showDelete: boolean
  onSave: (issue: WebsiteIssue) => void
  onDelete: () => void
}

export default function PolicyForm({
  initial,
  showDelete,
  onSave,
  onDelete,
}: PolicyFormProps): React.JSX.Element {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  // Seed the length from the existing description so Save isn't falsely
  // blocked before the dynamically-loaded editor fires its first
  // onTextLengthChange when editing an existing policy.
  const [descriptionPlainLength, setDescriptionPlainLength] = useState(() =>
    getBioPlainLength(initial?.description),
  )
  const [initialDescription] = useState(initial?.description ?? '')
  // The Save button is always enabled so the user can attempt to save and get
  // a guiding error instead of a silently-disabled button. Errors (alert +
  // red field borders) only surface once they've tried to save.
  const [attemptedSave, setAttemptedSave] = useState(false)

  const trimmedTitle = title.trim()
  const { titleInvalid, focusInvalid, message } = getPolicyFormValidation(
    trimmedTitle.length,
    descriptionPlainLength,
  )

  const handleSave = () => {
    if (message) {
      setAttemptedSave(true)
      return
    }
    onSave({ title: trimmedTitle, description })
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 p-6">
      <h2 className="text-lg font-semibold">Policy priority</h2>

      {attemptedSave && message && (
        <Alert variant="destructive" icon={<CircleAlertIcon />}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="policy-title" className="text-sm font-medium">
          Policy title
        </label>
        <Input
          id="policy-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={attemptedSave && titleInvalid}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-medium">Policy focus</div>
        <RichEditor
          initialText={initialDescription}
          onChangeCallback={setDescription}
          onTextLengthChange={setDescriptionPlainLength}
          error={attemptedSave && focusInvalid}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{MIN_POLICY_FOCUS_LENGTH} character minimum</span>
          <span>{descriptionPlainLength}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        {showDelete ? (
          <Button
            type="button"
            variant="outline"
            size="medium"
            onClick={onDelete}
          >
            Delete
          </Button>
        ) : (
          <span />
        )}
        <Button type="button" size="medium" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
