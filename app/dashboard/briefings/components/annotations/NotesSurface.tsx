'use client'

import { Button, FileTextIcon } from '@styleguide'
import type { Annotation } from '@shared/briefings/types'
import { AnnotationSurfaceSheet } from './AnnotationSurfaceSheet'
import type { EnrichedAnnotation } from './enrichForCycler'
import { AnchoredQuote } from './AnchoredQuote'
import { SurfaceEmptyState } from './SurfaceEmptyState'
import { useEnrichedAnnotations } from './useEnrichedAnnotations'

interface Props {
  open: boolean
  onClose: () => void
  annotations: Annotation[]
  onEditNote: (annotation: Annotation) => void
  initialAnnotationId?: string
}

function NoteBody({ item }: { item: EnrichedAnnotation }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      {item.highlightedText ? (
        <AnchoredQuote text={item.highlightedText} />
      ) : null}
      <div className="flex gap-3 whitespace-pre-wrap rounded-md border border-border bg-card p-4 text-base text-card-foreground">
        <FileTextIcon
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        />
        <div className="min-w-0 flex-1">{item.note?.body ?? ''}</div>
      </div>
      <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span>Edited {new Date(item.updatedAt).toLocaleString()}</span>
      </div>
    </div>
  )
}

export function NotesSurface({
  open,
  onClose,
  annotations,
  onEditNote,
  initialAnnotationId,
}: Props) {
  const items = useEnrichedAnnotations(open, annotations, 'note')
  return (
    <AnnotationSurfaceSheet
      open={open}
      onClose={onClose}
      title="Notes"
      subtitle="Highlight any text to add a note."
      positionLabel="Note"
      items={items}
      renderItem={(item) => <NoteBody item={item} />}
      footer={(current) =>
        current ? (
          <Button
            variant="outline"
            size="small"
            onClick={() => onEditNote(current)}
          >
            Edit note
          </Button>
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
