'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Textarea,
} from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'
import type { SheetState } from './AnnotationsScope'
import { useClearSelectionOnOpen } from './useClearSelectionOnOpen'

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
  const isDesktop = !useIsMobile()
  const direction = isDesktop ? 'right' : 'bottom'

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

  // Clear the user's text selection once the drawer opens — leaving a live
  // selection blocks Vaul's drag-to-dismiss.
  useClearSelectionOnOpen(open)

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
    <Drawer
      open={open}
      onOpenChange={(v) => (v ? null : onClose())}
      direction={direction}
    >
      <DrawerContent className="flex flex-col gap-0 p-0 lg:max-w-[480px]">
        <DrawerHeader className="px-6 pb-4 pr-12 pt-6">
          <DrawerTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Report or Correct an Error
          </DrawerTitle>
        </DrawerHeader>

        <div
          data-vaul-no-drag
          className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4"
        >
          {quote ? (
            <blockquote className="border-l-2 border-destructive/40 pl-3 text-sm italic leading-6 text-foreground">
              {quote}
            </blockquote>
          ) : null}

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isView}
            placeholder="Describe the error or suggested correction…"
            rows={6}
            className="min-h-[160px] resize-none rounded-2xl disabled:cursor-default disabled:opacity-90"
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

        <div
          data-vaul-no-drag
          className="flex flex-col gap-2 border-t border-border bg-background px-4 py-3 lg:border-t-0"
        >
          {isView ? (
            <Button
              type="button"
              variant="link"
              disabled={saving}
              onClick={handleDelete}
              className="text-destructive"
            >
              Delete report
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="w-full"
            >
              {saving ? 'Submitting…' : 'Submit'}
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
