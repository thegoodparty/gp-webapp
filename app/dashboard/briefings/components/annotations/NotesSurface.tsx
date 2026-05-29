'use client'

import { useRef, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Button, PencilIcon, Textarea } from '@styleguide'
import type { Annotation, Item } from '@shared/briefings/types'
import { reportErrorToSentry } from '@shared/sentry'
import { AnnotationSurfaceSheet } from './AnnotationSurfaceSheet'
import type { EnrichedAnnotation } from './enrichForCycler'
import { AnchoredQuote } from './AnchoredQuote'
import AttachmentThumbnail, { type AttachmentItem } from './AttachmentThumbnail'
import { DeleteAnnotationButton } from './DeleteAnnotationButton'
import { SurfaceEmptyState } from './SurfaceEmptyState'
import { useEnrichedAnnotations } from './useEnrichedAnnotations'
import { sectionLabelFromPath } from './sectionLabel'
import { useDictationAppend } from '../../shared/useDictationAppend'
import { DictationMicButton } from '../../shared/DictationMicButton'
import { DictationFeedback } from '../../shared/DictationFeedback'
import NoteAttachmentPicker from './NoteAttachmentPicker'

interface Props {
  open: boolean
  onClose: () => void
  annotations: Annotation[]
  /**
   * Persist an in-place body edit. NotesSurface keeps draft state local
   * and only calls this once the user clicks Save; on success it returns
   * to view mode. On rejection it surfaces the error and keeps the
   * card in edit mode so the user can retry without losing their text.
   */
  onSaveEdit: (annotationId: string, body: string) => Promise<void>
  /**
   * Upload one attachment file against an existing note. NotesSurface
   * fires this in-place via the lifted NoteAttachmentPicker (no
   * AddNoteSheet drawer routing).
   */
  onUploadAttachment: (annotationId: string, file: File) => Promise<void>
  /** Delete one attachment from an existing note, in-place. */
  onDeleteAttachment: (
    annotationId: string,
    attachmentId: string,
  ) => Promise<void>
  onDeleteNote: (annotation: Annotation) => Promise<void>
  initialAnnotationId?: string
  /**
   * Agenda items used to resolve the uppercase section label that sits
   * above an anchored note's quoted text (e.g. "COLONIAL THEATRE...").
   */
  briefingItems?: readonly Item[]
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

function NoteBody({
  item,
  briefingItems,
  editing,
  draftBody,
  onDraftChange,
  onCancelEdit,
  onCommitEdit,
  saving,
  saveError,
  onRemoveAttachment,
  busyAttachmentIds,
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
  onRemoveAttachment: (attachmentId: string) => void
  busyAttachmentIds: ReadonlySet<string>
}) {
  const attachments = item.note?.attachments ?? []
  // Map server attachments into the shared thumbnail shape so the same
  // tile drives both the picker and the read-only view. The X overlay
  // is wired to `onRemoveAttachment` so removal stays inline (no edit-
  // mode required); `busy` reflects the lifted busy-id set.
  const attachmentItems: AttachmentItem[] = attachments.map((att) => ({
    kind: 'server',
    id: att.id,
    label: att.fileName,
    mimeType: att.mimeType,
    annotationId: item.id,
    attachmentId: att.id,
    busy: busyAttachmentIds.has(att.id),
  }))
  const sectionLabel = sectionLabelFromPath(item.jsonPath, briefingItems)
  const dictation = useDictationAppend({
    analyticsLabel: 'notes_surface_edit',
    value: draftBody,
    onChange: onDraftChange,
  })
  const canSave = draftBody.trim().length > 0 && !saving

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      {/* Anchored notes get the full AnchoredQuote (label + quoted text).
          Card-level notes (no `highlightedText`) still get the uppercase
          section label by itself so the viewer can see which card the
          note belongs to — matches the parity behavior in AddNoteSheet. */}
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
          <span className="font-semibold text-foreground">You</span>
          <span className="text-xs text-muted-foreground">
            {relativeTime(item.updatedAt)}
          </span>
        </div>
        {editing ? (
          <>
            <div className="relative">
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
                placeholder="Write a note, then tap Save..."
                rows={3}
                disabled={saving}
                className="max-h-[180px] min-h-[96px] w-full resize-none rounded-2xl pr-12"
              />
              <DictationMicButton
                dictation={dictation}
                idleLabel="Dictate note"
                recordingLabel="Stop dictation"
                disabled={saving}
              />
            </div>
            <DictationFeedback dictation={dictation} />
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
            {item.note?.body ?? ''}
          </div>
        )}
        {!editing && attachmentItems.length > 0 ? (
          <ul className="flex list-none flex-col gap-2 pt-2">
            {attachmentItems.map((att) => (
              <li key={att.id}>
                <AttachmentThumbnail item={att} onRemove={onRemoveAttachment} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export function NotesSurface({
  open,
  onClose,
  annotations,
  onSaveEdit,
  onUploadAttachment,
  onDeleteAttachment,
  onDeleteNote,
  initialAnnotationId,
  briefingItems,
}: Props) {
  const items = useEnrichedAnnotations(open, annotations, 'note')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftBody, setDraftBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [busyAttachmentIds, setBusyAttachmentIds] = useState<Set<string>>(
    () => new Set(),
  )
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  // Tracks the id of the currently-focused annotation so async attachment
  // callbacks can verify the user hasn't cycled away before surfacing
  // attachment errors against a different note.
  const currentIdRef = useRef<string | null>(null)

  function markBusy(id: string, busy: boolean) {
    setBusyAttachmentIds((prev) => {
      const next = new Set(prev)
      if (busy) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function startEdit(item: EnrichedAnnotation) {
    setEditingId(item.id)
    setDraftBody(item.note?.body ?? '')
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
        surface: 'briefing-annotations',
        op: 'updateNote',
        annotationId: item.id,
      })
      const msg = err instanceof Error ? err.message : String(err)
      setSaveError(`Couldn't save your note: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnnotationSurfaceSheet
      open={open}
      onClose={onClose}
      title={null}
      accessibleTitle="Notes"
      subtitle="Add a note to this agenda item or highlight any text to add a note for just that part."
      positionLabel="Note"
      items={items}
      onActiveAnnotationChange={(nextId) => {
        // Clear per-annotation UI state so an error on one note doesn't
        // bleed into the next when the user cycles to a different note.
        // Only clear the edit draft when the focused annotation actually
        // changes — transient refetches that produce a fresh annotation
        // reference with the same id must not wipe the user's in-progress
        // typing.
        currentIdRef.current = nextId
        setSaveError(null)
        setAttachmentError(null)
        setBusyAttachmentIds(new Set())
        if (editingId && nextId !== editingId && !saving) {
          setEditingId(null)
          setDraftBody('')
        }
      }}
      renderItem={(item) => (
        <NoteBody
          item={item}
          briefingItems={briefingItems}
          editing={editingId === item.id}
          draftBody={draftBody}
          onDraftChange={setDraftBody}
          onCancelEdit={cancelEdit}
          onCommitEdit={() => void commitEdit(item)}
          saving={saving}
          saveError={editingId === item.id ? saveError : null}
          busyAttachmentIds={busyAttachmentIds}
          onRemoveAttachment={(attachmentId) => {
            setAttachmentError(null)
            markBusy(attachmentId, true)
            const startedAtId = item.id
            void (async () => {
              try {
                await onDeleteAttachment(startedAtId, attachmentId)
              } catch (err) {
                reportErrorToSentry(err, {
                  surface: 'briefing-annotations',
                  op: 'deleteAttachment',
                  annotationId: startedAtId,
                  attachmentId,
                })
                const msg = err instanceof Error ? err.message : String(err)
                if (currentIdRef.current === startedAtId) {
                  setAttachmentError(`Couldn't remove attachment: ${msg}`)
                }
              } finally {
                if (currentIdRef.current === startedAtId) {
                  markBusy(attachmentId, false)
                }
              }
            })()
          }}
        />
      )}
      footer={(current) => {
        if (!current) return null
        const isEditingCurrent = editingId === current.id
        return (
          <div className="flex flex-col gap-2">
            {/* While editing, Save/Cancel live inside the note card.
                Add attachment + Edit Note hide; Delete note stays so the
                user can still trash the note mid-edit (matches Lovable). */}
            {isEditingCurrent ? null : (
              <>
                <NoteAttachmentPicker
                  items={[]}
                  onAdd={(file) => {
                    setAttachmentError(null)
                    const startedAtId = current.id
                    void (async () => {
                      try {
                        await onUploadAttachment(startedAtId, file)
                      } catch (err) {
                        reportErrorToSentry(err, {
                          surface: 'briefing-annotations',
                          op: 'uploadAttachment',
                          annotationId: startedAtId,
                          fileName: file.name,
                        })
                        const msg =
                          err instanceof Error ? err.message : String(err)
                        if (currentIdRef.current === startedAtId) {
                          setAttachmentError(
                            `Couldn't attach ${file.name}: ${msg}`,
                          )
                        }
                      }
                    })()
                  }}
                  onRemove={(attachmentId) => {
                    setAttachmentError(null)
                    markBusy(attachmentId, true)
                    const startedAtId = current.id
                    void (async () => {
                      try {
                        await onDeleteAttachment(startedAtId, attachmentId)
                      } catch (err) {
                        reportErrorToSentry(err, {
                          surface: 'briefing-annotations',
                          op: 'deleteAttachment',
                          annotationId: startedAtId,
                          attachmentId,
                        })
                        const msg =
                          err instanceof Error ? err.message : String(err)
                        if (currentIdRef.current === startedAtId) {
                          setAttachmentError(
                            `Couldn't remove attachment: ${msg}`,
                          )
                        }
                      } finally {
                        if (currentIdRef.current === startedAtId) {
                          markBusy(attachmentId, false)
                        }
                      }
                    })()
                  }}
                  error={attachmentError}
                />
                <Button
                  onClick={() => startEdit(current)}
                  className="w-full gap-2 text-sm!"
                >
                  <PencilIcon className="size-4" aria-hidden="true" />
                  Edit Note
                </Button>
              </>
            )}
            <DeleteAnnotationButton
              current={current}
              label="Delete note"
              title="Delete this note?"
              description="This note will be permanently removed. You can't undo this."
              onDelete={onDeleteNote}
            />
          </div>
        )
      }}
      emptyState={
        <SurfaceEmptyState
          label="No notes yet"
          message="Highlight a passage in the briefing to add one."
        />
      }
      initialAnnotationId={initialAnnotationId}
    />
  )
}
