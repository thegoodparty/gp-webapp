'use client'
import { Button, Input } from '@styleguide'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { WebsiteIssue } from 'helpers/types'
import { MIN_POLICY_FOCUS_LENGTH } from '../candidateProfile.utils'

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
  const [descriptionPlainLength, setDescriptionPlainLength] = useState(0)
  const [initialDescription] = useState(initial?.description ?? '')

  const trimmedTitle = title.trim()
  const canSave =
    trimmedTitle.length > 0 && descriptionPlainLength >= MIN_POLICY_FOCUS_LENGTH

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-lg font-semibold">Policy priority</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="policy-title" className="text-sm font-medium">
          Policy title
        </label>
        <Input
          id="policy-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-medium">Policy focus</div>
        <RichEditor
          initialText={initialDescription}
          onChangeCallback={setDescription}
          onTextLengthChange={setDescriptionPlainLength}
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
        <Button
          type="button"
          size="medium"
          disabled={!canSave}
          onClick={() => onSave({ title: trimmedTitle, description })}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
