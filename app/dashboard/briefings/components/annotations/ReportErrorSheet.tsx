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
import { reportErrorToSentry } from '@shared/sentry'
import type { SheetState } from './AnnotationsScope'
import type { PredictedPosition } from './enrichForCycler'
import { useClearSelectionOnOpen } from './useClearSelectionOnOpen'
import { AnchoredQuote } from './AnchoredQuote'
import { useDictationAppend } from '../../shared/useDictationAppend'
import { DictationMicButton } from '../../shared/DictationMicButton'
import { DictationFeedback } from '../../shared/DictationFeedback'

type Props = {
  sheet: SheetState
  position: PredictedPosition | null
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
  position,
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const dictation = useDictationAppend({
    analyticsLabel: 'report_error_sheet',
    value: description,
    onChange: setDescription,
  })

  useEffect(() => {
    if (sheet.kind === 'report_error_view') {
      setDescription(sheet.annotation.bugReport?.description ?? '')
    } else if (sheet.kind === 'report_error_new') {
      setDescription('')
    }
    setErrorMessage(null)
  }, [sheet])

  // Clear the user's text selection once the drawer opens — leaving a live
  // selection blocks Vaul's drag-to-dismiss.
  useClearSelectionOnOpen(open)

  const quote = quoteFor(sheet)
  const isView = sheet.kind === 'report_error_view'

  async function handleSubmit() {
    if (saving || sheet.kind !== 'report_error_new') return
    setSaving(true)
    setErrorMessage(null)
    try {
      await onCreate(sheet.anchor, description)
      onClose()
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'createBugReport',
      })
      setErrorMessage("Couldn't submit. Try again.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (saving || sheet.kind !== 'report_error_view') return
    setSaving(true)
    setErrorMessage(null)
    try {
      await onDelete(sheet.annotation.id)
      onClose()
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'remove',
      })
      setErrorMessage("Couldn't delete report. Try again.")
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
      <DrawerContent className="flex flex-col gap-0 p-0 data-[vaul-drawer-direction=right]:sm:max-w-[480px]">
        <DrawerHeader className="gap-2 border-b border-border px-6 pb-4 pr-12 pt-6">
          {/* Heading is kept for screen readers only — visually omitted to
              match the other annotation surfaces, which lead with the byline
              rather than a left-aligned title. */}
          <DrawerTitle className="sr-only">
            Report or correct an error
          </DrawerTitle>
          {position ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Bug {position.position} of {position.total}
              </span>
            </div>
          ) : null}
          <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
            Spot an error? Mark it in your briefing, and your bug report will
            help us improve.
          </p>
        </DrawerHeader>

        <div
          data-vaul-no-drag
          className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4 pt-4"
        >
          {quote ? (
            <AnchoredQuote
              text={quote}
              variant="destructive"
              showLabel={false}
            />
          ) : null}

          <div className="relative">
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (!isView) setErrorMessage(null)
              }}
              disabled={isView}
              placeholder="Describe the error or suggested correction…"
              rows={6}
              className="min-h-[160px] w-full resize-none rounded-2xl pr-12 disabled:cursor-default disabled:opacity-90"
            />
            {!isView ? (
              <DictationMicButton
                dictation={dictation}
                idleLabel="Dictate error report"
                recordingLabel="Stop dictation"
                disabled={saving}
              />
            ) : null}
          </div>
          {!isView ? <DictationFeedback dictation={dictation} /> : null}
        </div>

        <div
          data-vaul-no-drag
          className="flex flex-col gap-2 border-t border-border bg-background px-4 py-3 lg:border-t-0"
        >
          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
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
