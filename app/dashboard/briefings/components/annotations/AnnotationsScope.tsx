'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  pointToOffset,
  type ResolvedAnchor,
} from '@shared/briefings/anchorResolver'
import { useAnnotations } from '@shared/briefings/use-annotations'
import { useSelection } from '@shared/briefings/use-selection'
import type { Annotation, AnnotationAnchor } from '@shared/briefings/types'
import HighlightToolbar from './HighlightToolbar'
import AddNoteSheet from './AddNoteSheet'
import ReportErrorSheet from './ReportErrorSheet'
import AnnotationsHighlightLayer from './AnnotationsHighlightLayer'

/**
 * Either an in-progress selection-driven anchor, or null for a top-level
 * (page-scoped) annotation.
 */
export type PendingAnchor = ResolvedAnchor | null

export type SheetState =
  | { kind: 'closed' }
  | { kind: 'add_note_new'; anchor: PendingAnchor }
  | { kind: 'add_note_edit'; annotation: Annotation }
  | { kind: 'report_error_new'; anchor: PendingAnchor }
  | { kind: 'report_error_view'; annotation: Annotation }

type Ctx = {
  openAddNoteFromSelection: () => void
  openAddNoteTopLevel: () => void
  openReportErrorFromSelection: () => void
  openEditNote: (annotation: Annotation) => void
  openViewReport: (annotation: Annotation) => void
  closeSheet: () => void
}

const AnnotationsCtx = createContext<Ctx | null>(null)

export function useAnnotationsCtx(): Ctx {
  const ctx = useContext(AnnotationsCtx)
  if (!ctx) throw new Error('useAnnotationsCtx outside <AnnotationsScope>')
  return ctx
}

type Props = {
  briefingId: string
  children: React.ReactNode
}

function anchorPayload(anchor: PendingAnchor): AnnotationAnchor {
  if (!anchor) return { jsonPath: null, start: null, end: null }
  return { jsonPath: anchor.jsonPath, start: anchor.start, end: anchor.end }
}

/**
 * Wraps the briefing detail content in the annotations layer. Renders:
 *  - The HighlightToolbar (anchored to the live selection)
 *  - The AnnotationsHighlightLayer (persistent backgrounds for existing notes)
 *  - The AddNoteSheet and ReportErrorSheet (single instances each)
 *
 * Also handles click-to-open: clicking inside an existing highlight opens
 * the corresponding annotation's Sheet.
 */
export default function AnnotationsScope({
  briefingId,
  children,
}: Props): React.JSX.Element {
  const liveAnchor = useSelection()
  const { annotations, create, updateNote, remove } = useAnnotations(briefingId)
  const [sheet, setSheet] = useState<SheetState>({ kind: 'closed' })

  const openAddNoteFromSelection = useCallback(() => {
    setSheet({ kind: 'add_note_new', anchor: liveAnchor })
  }, [liveAnchor])

  const openAddNoteTopLevel = useCallback(() => {
    setSheet({ kind: 'add_note_new', anchor: null })
  }, [])

  const openReportErrorFromSelection = useCallback(() => {
    setSheet({ kind: 'report_error_new', anchor: liveAnchor })
  }, [liveAnchor])

  const openEditNote = useCallback((annotation: Annotation) => {
    setSheet({ kind: 'add_note_edit', annotation })
  }, [])

  const openViewReport = useCallback((annotation: Annotation) => {
    setSheet({ kind: 'report_error_view', annotation })
  }, [])

  const closeSheet = useCallback(() => {
    setSheet({ kind: 'closed' })
  }, [])

  // Click-to-open: if the user clicks (collapsed mouseup) inside a region
  // covered by an existing annotation, open that annotation's Sheet.
  useEffect(() => {
    if (typeof window === 'undefined') return

    function openAnnotation(ann: Annotation) {
      if (ann.kind === 'note') {
        setSheet({ kind: 'add_note_edit', annotation: ann })
      } else if (ann.kind === 'bug_report') {
        setSheet({ kind: 'report_error_view', annotation: ann })
      }
      // Chat: TODO phase 7.
    }

    function onClick(e: MouseEvent) {
      // Don't intercept drag-to-select: only handle plain clicks.
      const sel = window.getSelection()
      if (sel && !sel.isCollapsed && sel.toString().length > 0) return

      const target = e.target as HTMLElement | null
      if (!target) return

      // The bug-icon overlay lives outside the briefing content. Match it
      // first so clicks on the icon open the matching report sheet.
      const bugMarker = target.closest(
        '.briefing-bug-marker[data-annotation-id]',
      ) as HTMLElement | null
      if (bugMarker) {
        const id = bugMarker.dataset.annotationId
        const ann = id ? annotations.find((a) => a.id === id) : null
        if (ann) {
          openAnnotation(ann)
          e.preventDefault()
        }
        return
      }

      // Don't trigger from clicks on links, buttons, or other interactive
      // elements rendered inside the briefing content.
      if (target.closest('a, button, [role=button], input, textarea, select')) {
        return
      }

      const hit = pointToOffset(e.clientX, e.clientY)
      if (!hit) return

      for (const ann of annotations) {
        if (ann.jsonPath !== hit.jsonPath) continue
        if (ann.start === null || ann.end === null) continue
        if (hit.offset < ann.start || hit.offset >= ann.end) continue
        openAnnotation(ann)
        e.preventDefault()
        return
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [annotations])

  const ctxValue: Ctx = {
    openAddNoteFromSelection,
    openAddNoteTopLevel,
    openReportErrorFromSelection,
    openEditNote,
    openViewReport,
    closeSheet,
  }

  return (
    <AnnotationsCtx.Provider value={ctxValue}>
      {children}
      <AnnotationsHighlightLayer annotations={annotations} />
      <HighlightToolbar
        anchor={liveAnchor}
        onAddNote={openAddNoteFromSelection}
        onReportError={openReportErrorFromSelection}
      />
      {(sheet.kind === 'add_note_new' || sheet.kind === 'add_note_edit') && (
        <AddNoteSheet
          sheet={sheet}
          onClose={closeSheet}
          onCreate={async (anchor, body) => {
            await create.mutateAsync({
              kind: 'note',
              anchor: anchorPayload(anchor),
              payload: { body },
            })
            window.getSelection()?.removeAllRanges()
          }}
          onUpdate={async (id, body) => {
            await updateNote.mutateAsync({ id, body })
          }}
          onDelete={async (id) => {
            await remove.mutateAsync(id)
          }}
        />
      )}
      {(sheet.kind === 'report_error_new' ||
        sheet.kind === 'report_error_view') && (
        <ReportErrorSheet
          sheet={sheet}
          onClose={closeSheet}
          onCreate={async (anchor, description) => {
            await create.mutateAsync({
              kind: 'bug_report',
              anchor: anchorPayload(anchor),
              payload: { description },
            })
            window.getSelection()?.removeAllRanges()
          }}
          onDelete={async (id) => {
            await remove.mutateAsync(id)
          }}
        />
      )}
    </AnnotationsCtx.Provider>
  )
}
