'use client'
import { Button, Input, Textarea } from '@styleguide'
import { useState } from 'react'
import { CustomIssue } from 'helpers/types'
import { MIN_POLICY_FOCUS_LENGTH } from '../candidateProfile.utils'

interface PolicyFormProps {
  initial?: CustomIssue
  showDelete: boolean
  onSave: (issue: CustomIssue) => void
  onDelete: () => void
}

export default function PolicyForm({
  initial,
  showDelete,
  onSave,
  onDelete,
}: PolicyFormProps): React.JSX.Element {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [position, setPosition] = useState(initial?.position ?? '')

  const trimmedTitle = title.trim()
  const trimmedPosition = position.trim()
  const canSave =
    trimmedTitle.length > 0 && trimmedPosition.length >= MIN_POLICY_FOCUS_LENGTH

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
        <label htmlFor="policy-focus" className="text-sm font-medium">
          Policy focus
        </label>
        <Textarea
          id="policy-focus"
          rows={4}
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{MIN_POLICY_FOCUS_LENGTH} character minimum</span>
          <span>{trimmedPosition.length}</span>
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
          onClick={() =>
            onSave({ title: trimmedTitle, position: trimmedPosition })
          }
        >
          Save
        </Button>
      </div>
    </div>
  )
}
