'use client'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { stripHtml } from 'string-strip-html'
import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'
import AlertDialog from '@shared/utils/AlertDialog'
import { WebsiteIssue } from 'helpers/types'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import PolicyForm from './PolicyForm'

const POLICY_MODAL_MODE = {
  ADD: 'add',
  EDIT: 'edit',
} as const

type PolicyModalMode =
  (typeof POLICY_MODAL_MODE)[keyof typeof POLICY_MODAL_MODE]

type ModalState =
  | { open: false }
  | { open: true; mode: typeof POLICY_MODAL_MODE.ADD }
  | { open: true; mode: typeof POLICY_MODAL_MODE.EDIT; index: number }

interface PolicyPrioritiesProps {
  issues: WebsiteIssue[]
  onChange: (issues: WebsiteIssue[]) => void
  disabled?: boolean
}

const buildFormKey = (mode: PolicyModalMode, index?: number): string =>
  mode === POLICY_MODAL_MODE.EDIT ? `${mode}-${index}` : mode

export default function PolicyPriorities({
  issues,
  onChange,
  disabled,
}: PolicyPrioritiesProps): React.JSX.Element {
  const [modal, setModal] = useState<ModalState>({ open: false })
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  )

  const handleClickAdd = () => {
    trackEvent(EVENTS.Profile.PolicyPriorities.ClickAdd)
    setModal({ open: true, mode: POLICY_MODAL_MODE.ADD })
  }

  const handleClickEdit = (index: number) => {
    trackEvent(EVENTS.Profile.PolicyPriorities.ClickEdit)
    setModal({ open: true, mode: POLICY_MODAL_MODE.EDIT, index })
  }

  const handleCancel = () => {
    if (modal.open) {
      trackEvent(
        modal.mode === POLICY_MODAL_MODE.EDIT
          ? EVENTS.Profile.PolicyPriorities.CancelEdit
          : EVENTS.Profile.PolicyPriorities.CancelAdd,
      )
    }
    setModal({ open: false })
  }

  const handleSave = (issue: WebsiteIssue) => {
    if (!modal.open) return
    if (modal.mode === POLICY_MODAL_MODE.EDIT) {
      trackEvent(EVENTS.Profile.PolicyPriorities.SubmitEdit)
      const next = [...issues]
      next[modal.index] = issue
      onChange(next)
    } else {
      trackEvent(EVENTS.Profile.PolicyPriorities.SubmitAdd)
      onChange([...issues, issue])
    }
    setModal({ open: false })
  }

  const handleClickDelete = () => {
    if (!modal.open || modal.mode !== POLICY_MODAL_MODE.EDIT) return
    trackEvent(EVENTS.Profile.PolicyPriorities.ClickDelete)
    setPendingDeleteIndex(modal.index)
    setModal({ open: false })
  }

  const handleCancelDelete = () => {
    trackEvent(EVENTS.Profile.PolicyPriorities.CancelDelete)
    setPendingDeleteIndex(null)
  }

  const handleConfirmDelete = () => {
    if (pendingDeleteIndex === null) return
    trackEvent(EVENTS.Profile.PolicyPriorities.SubmitDelete)
    onChange(issues.filter((_, i) => i !== pendingDeleteIndex))
    setPendingDeleteIndex(null)
    setModal({ open: false })
  }

  const isEditing = modal.open && modal.mode === POLICY_MODAL_MODE.EDIT
  const initial = isEditing ? issues[modal.index] : undefined
  const formKey = modal.open
    ? buildFormKey(modal.mode, isEditing ? modal.index : undefined)
    : POLICY_MODAL_MODE.ADD

  return (
    <div>
      <div className="flex flex-col gap-3">
        {issues.map((issue, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => handleClickEdit(index)}
            aria-label={`Edit ${issue.title}`}
            className="flex items-start gap-2 rounded-md border border-input bg-white px-3 py-2 text-left transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-base">{issue.title}</div>
              <div className="truncate text-sm text-foreground">
                {issue.description ? stripHtml(issue.description).result : ''}
              </div>
            </div>
            <Pencil className="mt-1 h-4 w-4 shrink-0" aria-hidden />
          </button>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={handleClickAdd}
          aria-label="Add a policy priority"
          className="flex items-center gap-2 rounded-md border border-dashed border-input bg-white px-3 py-2 text-base text-muted-foreground transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add a policy priority
        </button>
      </div>

      <ModalOrDrawer
        open={modal.open}
        onOpenChange={(open) => {
          if (!open) handleCancel()
        }}
        title="Policy priority"
      >
        <PolicyForm
          key={formKey}
          initial={initial}
          showDelete={isEditing}
          onSave={handleSave}
          onDelete={handleClickDelete}
        />
      </ModalOrDrawer>

      <AlertDialog
        open={pendingDeleteIndex !== null}
        title="Delete policy priority"
        description="Are you sure you want to delete this policy priority?"
        proceedLabel="Delete"
        handleClose={handleCancelDelete}
        handleProceed={handleConfirmDelete}
      />
    </div>
  )
}
