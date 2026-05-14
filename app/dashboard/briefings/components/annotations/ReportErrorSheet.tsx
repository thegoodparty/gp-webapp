'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@styleguide'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'
import type { SheetState } from './AnnotationsScope'

type Props = {
  sheet: SheetState
  onClose: () => void
  onCreate: (
    anchor: ResolvedAnchor | null,
    description: string,
  ) => Promise<void> | void
  onDelete: (annotationId: string) => Promise<void> | void
}

function quoteFor(state: SheetState): string | null {
  if (state.kind === 'report_error_new') return state.anchor?.quote ?? null
  return null
}

function isReportState(state: SheetState): boolean {
  return state.kind === 'report_error_new' || state.kind === 'report_error_view'
}

/**
 * Right-side Sheet for reporting or correcting an error in the briefing.
 *
 * Mirrors AddNoteSheet's layout but with a destructive-tinted blockquote and
 * different copy. Bug reports are write-once: the view mode shows the
 * submitted description and a delete option, but no editing.
 */
export default function ReportErrorSheet({
  sheet,
  onClose,
  onCreate,
  onDelete,
}: Props): React.JSX.Element {
  const open = isReportState(sheet)
  const initialDescription =
    sheet.kind === 'report_error_view'
      ? sheet.annotation.bugReport?.description ?? ''
      : ''
  const [description, setDescription] = useState(initialDescription)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (sheet.kind === 'report_error_view') {
      setDescription(sheet.annotation.bugReport?.description ?? '')
    } else if (sheet.kind === 'report_error_new') {
      setDescription('')
    }
  }, [sheet])

  const quote = quoteFor(sheet)
  const isView = sheet.kind === 'report_error_view'

  async function handleSubmit() {
    if (saving || sheet.kind !== 'report_error_new') return
    setSaving(true)
    try {
      await onCreate(sheet.anchor, description)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (saving || sheet.kind !== 'report_error_view') return
    setSaving(true)
    try {
      await onDelete(sheet.annotation.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const canSubmit = description.trim().length > 0 && !saving

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <SheetContent
        side="right"
        onPointerDownOutside={() => onClose()}
        onEscapeKeyDown={() => onClose()}
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
      >
        <SheetHeader className="px-6 pb-4 pr-12 pt-6">
          <SheetTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Report or Correct an Error
          </SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4">
          {quote ? (
            <blockquote className="rounded-md border-l-2 border-destructive/40 bg-muted/40 px-3 py-2 text-sm italic text-foreground">
              &ldquo;{quote}&rdquo;
            </blockquote>
          ) : null}

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isView}
            placeholder="Describe the error or suggested correction…"
            rows={6}
            className="min-h-[160px] w-full resize-none rounded-2xl border border-input bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-90"
          />

          {isView ? (
            <p className="text-xs text-muted-foreground">
              Submitted{' '}
              {sheet.kind === 'report_error_view' && sheet.annotation.bugReport
                ? new Date(
                    sheet.annotation.bugReport.submittedAt,
                  ).toLocaleString()
                : ''}
              .
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-border bg-background px-4 py-3 lg:border-t-0">
          {isView ? (
            <button
              type="button"
              disabled={saving}
              onClick={handleDelete}
              className="inline-flex h-10 w-full items-center justify-center rounded-full px-4 text-sm font-medium text-destructive hover:underline disabled:pointer-events-none disabled:opacity-50"
            >
              Delete report
            </button>
          ) : (
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {saving ? 'Submitting…' : 'Submit'}
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
