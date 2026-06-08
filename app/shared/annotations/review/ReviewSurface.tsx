'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  PencilIcon,
  Textarea,
} from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import type {
  Annotation,
  AnnotationAnchor,
  Item,
} from '@shared/briefings/types'
import { resolveQuoteFromAnchor } from '@shared/briefings/anchorResolver'
import { reportErrorToSentry } from '@shared/sentry'
import { AnnotationSurfaceSheet } from '../../../dashboard/briefings/components/annotations/AnnotationSurfaceSheet'
import type { EnrichedAnnotation } from '../../../dashboard/briefings/components/annotations/enrichForCycler'
import { AnchoredQuote } from '../../../dashboard/briefings/components/annotations/AnchoredQuote'
import { DeleteAnnotationButton } from '../../../dashboard/briefings/components/annotations/DeleteAnnotationButton'
import { SurfaceEmptyState } from '../../../dashboard/briefings/components/annotations/SurfaceEmptyState'
import { useEnrichedAnnotations } from '../../../dashboard/briefings/components/annotations/useEnrichedAnnotations'
import { sectionLabelFromPath } from '../../../dashboard/briefings/components/annotations/sectionLabel'

interface Props {
  open: boolean
  onClose: () => void
  annotations: Annotation[]
  /**
   * Persist an in-place body edit. ReviewSurface keeps draft state local
   * and only calls this once the reviewer clicks Save.
   */
  onSaveEdit: (annotationId: string, body: string) => Promise<void>
  onDeleteReview: (annotation: Annotation) => Promise<void>
  initialAnnotationId?: string
  briefingItems?: readonly Item[]
  /**
   * When set, the surface opens in compose mode against a client-only
   * anchor — no review row exists yet. The first Save POSTs via `onCreate`
   * (the gp-api review create requires a non-empty body, so Save stays
   * disabled until the reviewer types something). Closing with an empty
   * body discards the anchor without persisting anything.
   */
  pendingAnchor?: AnnotationAnchor | null
  onCreate?: (anchor: AnnotationAnchor, body: string) => Promise<void>
}

function relativeTime(iso: string): string {
  try {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ''
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return ''
  }
}

function ReviewBody({
  item,
  briefingItems,
  editing,
  draftBody,
  onDraftChange,
  onCancelEdit,
  onCommitEdit,
  saving,
  saveError,
}: {
  item: EnrichedAnnotation
  briefingItems?: readonly Item[]
  editing: boolean
  draftBody: string
  onDraftChange: (next: string) => void
  onCancelEdit: () => void
  onCommitEdit: () => void
  saving: boolean
  saveError: string | null
}) {
  const sectionLabel = sectionLabelFromPath(item.jsonPath, briefingItems)
  const canSave = draftBody.trim().length > 0 && !saving
  const reviewerEmail = item.review?.reviewer_email ?? null

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      {item.highlightedText ? (
        <AnchoredQuote
          text={item.highlightedText}
          showLabel={sectionLabel !== null}
          label={sectionLabel ?? undefined}
          filled
        />
      ) : sectionLabel ? (
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {sectionLabel}
        </span>
      ) : null}
      <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-4 text-card-foreground">
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold text-foreground">
            {reviewerEmail ?? 'Reviewer'}
          </span>
          <span className="text-xs text-muted-foreground">
            {relativeTime(item.updatedAt)}
          </span>
        </div>
        {editing ? (
          <>
            <Textarea
              value={draftBody}
              onChange={(e) => onDraftChange(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key !== 'Enter' ||
                  e.shiftKey ||
                  e.nativeEvent.isComposing
                ) {
                  return
                }
                e.preventDefault()
                if (canSave) onCommitEdit()
              }}
              placeholder="Write a review comment, then tap Save..."
              rows={3}
              disabled={saving}
              className="max-h-[180px] min-h-[96px] w-full resize-none rounded-2xl"
            />
            {saveError ? (
              <p role="alert" className="text-sm text-destructive">
                {saveError}
              </p>
            ) : null}
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="link"
                size="small"
                onClick={onCancelEdit}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onCommitEdit}
                disabled={!canSave}
                loading={saving}
              >
                Save
              </Button>
            </div>
          </>
        ) : (
          <div className="whitespace-pre-wrap text-base">
            {item.review?.body ?? ''}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Compose drawer for a not-yet-persisted review. Mirrors the cycler sheet's
 * Drawer chrome but holds a client-only anchor and an empty draft. Save is
 * blocked until the body is non-empty (the gp-api create rejects empty
 * bodies); closing discards the draft without persisting.
 */
function ReviewComposeSheet({
  open,
  onClose,
  anchor,
  briefingItems,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  anchor: AnnotationAnchor
  briefingItems?: readonly Item[]
  onCreate: (anchor: AnnotationAnchor, body: string) => Promise<void>
}) {
  const isDesktop = !useIsMobile()
  const direction = isDesktop ? 'right' : 'bottom'
  const [draftBody, setDraftBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Reset the draft each time the compose sheet opens against a new anchor.
  useEffect(() => {
    if (open) {
      setDraftBody('')
      setSaveError(null)
    }
  }, [open, anchor])

  const sectionLabel = sectionLabelFromPath(anchor.jsonPath, briefingItems)
  const quote = resolveQuoteFromAnchor(anchor)
  const canSave = draftBody.trim().length > 0 && !saving

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    setSaveError(null)
    try {
      await onCreate(anchor, draftBody.trim())
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-review',
        op: 'createReview',
      })
      const msg = err instanceof Error ? err.message : String(err)
      setSaveError(`Couldn't save your review comment: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => (v ? null : onClose())}
      direction={direction}
    >
      <DrawerContent className="flex flex-col gap-0 p-0 data-[vaul-drawer-direction=bottom]:max-h-[85vh] data-[vaul-drawer-direction=right]:sm:max-w-[480px]">
        <DrawerTitle className="sr-only">Add review comment</DrawerTitle>
        <DrawerDescription className="sr-only">
          Write a review comment for the anchored passage.
        </DrawerDescription>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
          {quote ? (
            <AnchoredQuote
              text={quote}
              showLabel={sectionLabel !== null}
              label={sectionLabel ?? undefined}
              filled
            />
          ) : sectionLabel ? (
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {sectionLabel}
            </span>
          ) : null}
          <Textarea
            autoFocus
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key !== 'Enter' ||
                e.shiftKey ||
                e.nativeEvent.isComposing
              ) {
                return
              }
              e.preventDefault()
              if (canSave) void handleSave()
            }}
            placeholder="Write a review comment, then tap Save..."
            rows={3}
            disabled={saving}
            className="max-h-[180px] min-h-[96px] w-full resize-none rounded-2xl"
          />
          {saveError ? (
            <p role="alert" className="text-sm text-destructive">
              {saveError}
            </p>
          ) : null}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="link"
              size="small"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={!canSave}
              loading={saving}
            >
              Save
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/**
 * Cycler drawer over persisted reviews. Modeled on NotesSurface but pared
 * down: a single body textarea per review, Save + Delete, no attachments
 * and no dictation.
 */
function ReviewCyclerSheet({
  open,
  onClose,
  annotations,
  onSaveEdit,
  onDeleteReview,
  initialAnnotationId,
  briefingItems,
}: Omit<Props, 'pendingAnchor' | 'onCreate'>) {
  const items = useEnrichedAnnotations(open, annotations, 'review')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftBody, setDraftBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  function startEdit(item: EnrichedAnnotation) {
    setEditingId(item.id)
    setDraftBody(item.review?.body ?? '')
    setSaveError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setDraftBody('')
    setSaveError(null)
  }

  async function commitEdit(item: EnrichedAnnotation) {
    if (saving) return
    setSaving(true)
    setSaveError(null)
    try {
      await onSaveEdit(item.id, draftBody)
      setEditingId(null)
      setDraftBody('')
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-review',
        op: 'updateReview',
        annotationId: item.id,
      })
      const msg = err instanceof Error ? err.message : String(err)
      setSaveError(`Couldn't save your review comment: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnnotationSurfaceSheet
      open={open}
      onClose={onClose}
      title={null}
      accessibleTitle="Review comments"
      subtitle="Highlight any text in the briefing to leave a review comment for the team."
      positionLabel="Comment"
      items={items}
      onActiveAnnotationChange={(nextId) => {
        setSaveError(null)
        if (editingId && nextId !== editingId && !saving) {
          setEditingId(null)
          setDraftBody('')
        }
      }}
      renderItem={(item) => (
        <ReviewBody
          item={item}
          briefingItems={briefingItems}
          editing={editingId === item.id}
          draftBody={draftBody}
          onDraftChange={setDraftBody}
          onCancelEdit={cancelEdit}
          onCommitEdit={() => void commitEdit(item)}
          saving={saving}
          saveError={editingId === item.id ? saveError : null}
        />
      )}
      footer={(current) => {
        if (!current) return null
        const isEditingCurrent = editingId === current.id
        return (
          <div className="flex flex-col gap-2">
            {isEditingCurrent ? null : (
              <Button
                onClick={() => startEdit(current)}
                className="w-full gap-2 text-sm!"
              >
                <PencilIcon className="size-4" aria-hidden="true" />
                Edit comment
              </Button>
            )}
            <DeleteAnnotationButton
              current={current}
              label="Delete comment"
              title="Delete this review comment?"
              description="This review comment will be permanently removed. You can't undo this."
              onDelete={onDeleteReview}
            />
          </div>
        )
      }}
      emptyState={
        <SurfaceEmptyState
          label="No review comments yet"
          message="Highlight a passage in the briefing to add one."
        />
      }
      initialAnnotationId={initialAnnotationId}
    />
  )
}

/**
 * Review-comment surface. Thin dispatcher with no hooks of its own so it
 * can switch between two children whose hook usage differs: a compose sheet
 * for a not-yet-persisted anchor, and the cycler over persisted reviews.
 * Compose mode takes precedence so the empty-body create path never POSTs.
 * Lives in the shared review/ folder so the admin-review route tree and any
 * future host can mount it without reaching into the candidate-facing
 * briefings dir.
 */
export function ReviewSurface({
  open,
  onClose,
  annotations,
  onSaveEdit,
  onDeleteReview,
  initialAnnotationId,
  briefingItems,
  pendingAnchor,
  onCreate,
}: Props) {
  if (pendingAnchor && onCreate) {
    return (
      <ReviewComposeSheet
        open={open}
        onClose={onClose}
        anchor={pendingAnchor}
        briefingItems={briefingItems}
        onCreate={onCreate}
      />
    )
  }
  return (
    <ReviewCyclerSheet
      open={open}
      onClose={onClose}
      annotations={annotations}
      onSaveEdit={onSaveEdit}
      onDeleteReview={onDeleteReview}
      initialAnnotationId={initialAnnotationId}
      briefingItems={briefingItems}
    />
  )
}
