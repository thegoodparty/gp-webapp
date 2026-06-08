'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  EMPTY_ANCHOR,
  pointToOffset,
  type ResolvedAnchor,
} from '@shared/briefings/anchorResolver'
import { useAnnotations } from '@shared/briefings/use-annotations'
import { useSelection } from '@shared/briefings/use-selection'
import type {
  Annotation,
  AnnotationAnchor,
  Item,
} from '@shared/briefings/types'
import {
  AnnotationsCtx,
  type ActiveCard,
  type Ctx as AnnotationsCtxValue,
} from '../../../dashboard/briefings/components/annotations/AnnotationsScope'
import ReviewHighlightLayer from './ReviewHighlightLayer'
import ReviewHighlightToolbar from './ReviewHighlightToolbar'
import { ReviewSurface } from './ReviewSurface'

type OverlayState =
  | { kind: 'closed' }
  | { kind: 'surface_reviews'; initialAnnotationId?: string }
  | { kind: 'compose_review'; anchor: AnnotationAnchor }

type ReviewCtx = {
  reviewsCount: number
  addReview: (anchor: AnnotationAnchor, body: string) => Promise<Annotation>
  editReview: (id: string, body: string) => Promise<void>
  deleteReview: (id: string) => Promise<void>
  openReviewsSurface: (initialAnnotationId?: string) => void
}

const ReviewAnnotationsCtx = createContext<ReviewCtx | null>(null)

export function useReviewAnnotationsCtx(): ReviewCtx {
  const ctx = useContext(ReviewAnnotationsCtx)
  if (!ctx) {
    throw new Error('useReviewAnnotationsCtx outside <ReviewAnnotationsScope>')
  }
  return ctx
}

type Props = {
  /** The briefing's meeting date (YYYY-MM-DD). */
  meetingDate: string
  initialActiveCard?: ActiveCard
  items?: readonly Item[]
  children: React.ReactNode
}

function anchorPayload(anchor: ResolvedAnchor | null): AnnotationAnchor {
  if (!anchor) return EMPTY_ANCHOR
  return { jsonPath: anchor.jsonPath, start: anchor.start, end: anchor.end }
}

const NOOP = () => undefined

/**
 * Review-mode peer of AnnotationsScope. Built purpose-small: it loads ONLY
 * review-kind annotations, renders a single-action toolbar + the review
 * cycler drawer + a teal highlight layer, and exposes review mutations for
 * the admin-review chrome to read.
 *
 * It still provides the candidate-facing AnnotationsCtx so the shared
 * briefing detail cards (which call `useAnnotationsCtx`) render unchanged —
 * but every note/chat/bug entry point on that context is a no-op here, and
 * `annotations` only ever carries reviews.
 */
export default function ReviewAnnotationsScope({
  meetingDate,
  initialActiveCard,
  items: briefingItems,
  children,
}: Props): React.JSX.Element {
  const liveAnchor = useSelection()
  const { annotations, create, updateReview, remove } = useAnnotations(
    { resourceType: 'briefing', resourceId: meetingDate },
    { kinds: ['review'] },
  )
  const [overlay, setOverlay] = useState<OverlayState>({ kind: 'closed' })
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(
    initialActiveCard ?? null,
  )

  const openReviewsSurface = useCallback((initialAnnotationId?: string) => {
    setOverlay({ kind: 'surface_reviews', initialAnnotationId })
  }, [])

  const closeSheet = useCallback(() => {
    setOverlay({ kind: 'closed' })
  }, [])

  // Compose-then-save: open the surface in compose mode holding a
  // client-only anchor. Nothing is POSTed yet — the gp-api review create
  // rejects empty bodies, so the row is only persisted once the reviewer
  // types something and hits Save (handled by `addReview` below).
  const openAddReviewFromSelection = useCallback(() => {
    if (!liveAnchor) return
    const anchor = anchorPayload(liveAnchor)
    window.getSelection()?.removeAllRanges()
    setOverlay({ kind: 'compose_review', anchor })
  }, [liveAnchor])

  const addReview = useCallback(
    (anchor: AnnotationAnchor, body: string) =>
      create.mutateAsync({ kind: 'review', anchor, payload: { body } }),
    [create],
  )

  const editReview = useCallback(
    async (id: string, body: string) => {
      await updateReview.mutateAsync({ id, body })
    },
    [updateReview],
  )

  const deleteReview = useCallback(
    async (id: string) => {
      await remove.mutateAsync(id)
    },
    [remove],
  )

  // Click-to-open: clicking inside a review highlight (or its marker) opens
  // that review in the cycler. Only review-kind annotations are handled.
  useEffect(() => {
    if (typeof window === 'undefined') return

    function onClick(e: MouseEvent) {
      const sel = window.getSelection()
      if (sel && !sel.isCollapsed && sel.toString().length > 0) return
      if (!(e.target instanceof HTMLElement)) return
      const target = e.target

      const marker = target.closest(
        '.briefing-review-marker[data-annotation-id]',
      )
      if (marker instanceof HTMLElement) {
        const id = marker.dataset.annotationId
        const ann = id ? annotations.find((a) => a.id === id) : null
        if (ann && ann.kind === 'review') {
          openReviewsSurface(ann.id)
          e.preventDefault()
        }
        return
      }

      if (target.closest('a, button, [role=button], input, textarea, select')) {
        return
      }

      const hit = pointToOffset(e.clientX, e.clientY)
      if (!hit) return
      for (const ann of annotations) {
        if (ann.kind !== 'review') continue
        if (ann.jsonPath !== hit.jsonPath) continue
        if (ann.start === null || ann.end === null) continue
        if (hit.offset < ann.start || hit.offset >= ann.end) continue
        openReviewsSurface(ann.id)
        e.preventDefault()
        return
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [annotations, openReviewsSurface])

  const reviewsCount = useMemo(
    () => annotations.filter((a) => a.kind === 'review').length,
    [annotations],
  )

  const reviewCtxValue: ReviewCtx = useMemo(
    () => ({
      reviewsCount,
      addReview,
      editReview,
      deleteReview,
      openReviewsSurface,
    }),
    [reviewsCount, addReview, editReview, deleteReview, openReviewsSurface],
  )

  // Candidate-facing context, satisfied with review-mode behavior so the
  // shared detail cards render. Note/chat/bug entry points are no-ops.
  const annotationsCtxValue: AnnotationsCtxValue = useMemo(
    () => ({
      meetingDate,
      topLevelChatAnnotationId: undefined,
      annotations,
      activeCard,
      setActiveCard,
      openAddNoteFromSelection: NOOP,
      openAddNoteTopLevel: NOOP,
      openReportErrorFromSelection: NOOP,
      openEditNote: NOOP,
      openViewReport: NOOP,
      openNotesSurface: NOOP,
      openChatsSurface: NOOP,
      openCardLevelChat: NOOP,
      openBugReportsSurface: NOOP,
      notesCount: 0,
      chatsCount: 0,
      bugReportsCount: 0,
      closeSheet,
      onChatCreated: NOOP,
    }),
    [meetingDate, annotations, activeCard, closeSheet],
  )

  return (
    <ReviewAnnotationsCtx.Provider value={reviewCtxValue}>
      <AnnotationsCtx.Provider value={annotationsCtxValue}>
        {children}
        <ReviewHighlightLayer annotations={annotations} />
        <ReviewHighlightToolbar
          anchor={liveAnchor}
          onAddReview={openAddReviewFromSelection}
        />
        <ReviewSurface
          open={
            overlay.kind === 'surface_reviews' ||
            overlay.kind === 'compose_review'
          }
          onClose={closeSheet}
          annotations={annotations}
          briefingItems={briefingItems}
          onSaveEdit={editReview}
          onDeleteReview={(ann) => deleteReview(ann.id).then(() => undefined)}
          initialAnnotationId={
            overlay.kind === 'surface_reviews'
              ? overlay.initialAnnotationId
              : undefined
          }
          pendingAnchor={
            overlay.kind === 'compose_review' ? overlay.anchor : null
          }
          onCreate={async (anchor, body) => {
            const created = await addReview(anchor, body)
            // First save persisted the review — swap from compose into the
            // cycler focused on the new row.
            setOverlay({
              kind: 'surface_reviews',
              initialAnnotationId: created.id,
            })
          }}
        />
      </AnnotationsCtx.Provider>
    </ReviewAnnotationsCtx.Provider>
  )
}
