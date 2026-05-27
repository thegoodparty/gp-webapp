'use client'

import { formatDistanceToNow } from 'date-fns'
import { Button, PencilIcon } from '@styleguide'
import type { Annotation } from '@shared/briefings/types'
import { AnnotationSurfaceSheet } from './AnnotationSurfaceSheet'
import type { EnrichedAnnotation } from './enrichForCycler'
import { AnchoredQuote } from './AnchoredQuote'
import AttachmentThumbnail, {
  type AttachmentItem,
} from './AttachmentThumbnail'
import { DeleteAnnotationButton } from './DeleteAnnotationButton'
import { SurfaceEmptyState } from './SurfaceEmptyState'
import { useEnrichedAnnotations } from './useEnrichedAnnotations'

interface Props {
  open: boolean
  onClose: () => void
  annotations: Annotation[]
  onEditNote: (annotation: Annotation) => void
  onDeleteNote: (annotation: Annotation) => Promise<void>
  initialAnnotationId?: string
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

function NoteBody({ item }: { item: EnrichedAnnotation }) {
  const attachments = item.note?.attachments ?? []
  const attachmentItems: AttachmentItem[] = attachments.map((att) => ({
    kind: 'server',
    id: att.id,
    label: att.fileName,
    mimeType: att.mimeType,
    annotationId: item.id,
    attachmentId: att.id,
  }))
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      {item.highlightedText ? (
        <AnchoredQuote text={item.highlightedText} showLabel={false} filled />
      ) : null}
      <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-4 text-card-foreground">
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold text-foreground">You</span>
          <span className="text-xs text-muted-foreground">
            {relativeTime(item.updatedAt)}
          </span>
        </div>
        <div className="whitespace-pre-wrap text-base">
          {item.note?.body ?? ''}
        </div>
        {attachmentItems.length > 0 ? (
          <ul className="flex list-none flex-wrap items-start gap-2 pt-2">
            {attachmentItems.map((att) => (
              <li key={att.id}>
                <AttachmentThumbnail item={att} />
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
  onEditNote,
  onDeleteNote,
  initialAnnotationId,
}: Props) {
  const items = useEnrichedAnnotations(open, annotations, 'note')
  return (
    <AnnotationSurfaceSheet
      open={open}
      onClose={onClose}
      title="Note"
      subtitle="Highlight any text to add a note."
      positionLabel="Note"
      items={items}
      renderItem={(item) => <NoteBody item={item} />}
      footer={(current) =>
        current ? (
          <div className="flex flex-col gap-2">
            {/*
              "Add attachment" used to live here as a separate button, but it
              routed to the same `onEditNote` handler as "Edit Note" — both
              opened the edit sheet, which already exposes the attachment
              picker. Dropping the duplicate avoids UX confusion. Edit Note
              is the single entry point for body edits and attachment
              management.
            */}
            <Button
              onClick={() => onEditNote(current)}
              className="w-full gap-2"
            >
              <PencilIcon className="size-4" aria-hidden="true" />
              Edit Note
            </Button>
            <DeleteAnnotationButton
              current={current}
              label="Delete note"
              title="Delete this note?"
              description="This note will be permanently removed. You can't undo this."
              onDelete={onDeleteNote}
            />
          </div>
        ) : null
      }
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
