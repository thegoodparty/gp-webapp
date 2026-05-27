'use client'

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
  initialAnnotationId?: string
}

function BugReportBody({ item }: { item: EnrichedAnnotation }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      {item.highlightedText ? (
        <AnchoredQuote
          text={item.highlightedText}
          variant="destructive"
          strike
        />
      ) : null}
      <div className="whitespace-pre-wrap rounded-md border border-destructive/30 bg-destructive/5 p-4 text-base leading-7 text-foreground">
        {item.bugReport?.description ?? ''}
      </div>
      <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Submitted{' '}
        {item.bugReport
          ? new Date(item.bugReport.submittedAt).toLocaleString()
          : ''}
      </div>
    </div>
  )
}

export function BugReportsSurface({
  open,
  onClose,
  annotations,
  initialAnnotationId,
}: Props) {
  const items = useEnrichedAnnotations(open, annotations, 'bug_report')
  return (
    <AnnotationSurfaceSheet
      open={open}
      onClose={onClose}
      title="Bug reports"
      positionLabel="Bug"
      items={items}
      renderItem={(item) => <BugReportBody item={item} />}
      emptyState={
        <SurfaceEmptyState
          label="No bug reports yet"
          message="Highlight a passage and use “Report” to flag an issue."
        />
      }
      initialAnnotationId={initialAnnotationId}
    />
  )
}
