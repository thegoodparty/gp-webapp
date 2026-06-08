'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  buildRangeIn,
  findAnchorEl,
  pointToOffset,
} from '@shared/briefings/anchorResolver'
import type { Annotation } from '@shared/briefings/types'

type Props = {
  annotations: Annotation[]
}

type ResolvedRange = {
  annotation: Annotation
  range: Range
}

const HIGHLIGHT_NAME = 'briefing-annotation-review'
const HOVER_NAME = 'briefing-annotation-review-hover'
const REVIEW_MARKER_CLASS = 'briefing-review-marker'
const STYLE_TAG_ID = 'briefing-review-highlight-style'

// Reviews use a teal treatment so they don't clash with the blue note /
// red bug highlights from the candidate-facing annotation layer.
const STYLE_RULES = `
::highlight(${HIGHLIGHT_NAME}) {
  background-color: color-mix(in srgb, var(--success, #0f9d8a) 24%, transparent);
  color: inherit;
}
::highlight(${HOVER_NAME}) {
  background-color: color-mix(in srgb, var(--success, #0f9d8a) 38%, transparent);
}
.${REVIEW_MARKER_CLASS} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.27em;
  vertical-align: middle;
  position: relative;
  top: -0.13em;
  margin: 0 4px 0 0;
  padding: 0 4px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  background-color: color-mix(in srgb, var(--success, #0f9d8a) 24%, transparent);
  color: var(--success, #0f9d8a);
}
.${REVIEW_MARKER_CLASS} svg {
  display: block;
  width: 14px;
  height: 14px;
  pointer-events: none;
}
.${REVIEW_MARKER_CLASS}[data-hover='true'] {
  background-color: color-mix(in srgb, var(--success, #0f9d8a) 34%, transparent);
  color: color-mix(in srgb, var(--success, #0f9d8a) 80%, black);
}
`

// Lucide MessageSquareText — distinct review-comment marker.
const REVIEW_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>`

const MARKER_SELECTOR = `.${REVIEW_MARKER_CLASS}[data-annotation-id]`

function removeAllMarkers() {
  if (typeof document === 'undefined') return
  const nodes = document.querySelectorAll(`.${REVIEW_MARKER_CLASS}`)
  for (const n of Array.from(nodes)) n.remove()
}

function insertMarker(range: Range, annotationId: string) {
  const span = document.createElement('span')
  span.className = REVIEW_MARKER_CLASS
  span.dataset.annotationId = annotationId
  span.setAttribute('contenteditable', 'false')
  span.setAttribute('aria-label', 'Open review comment')
  span.innerHTML = REVIEW_ICON_SVG
  const at = range.cloneRange()
  at.collapse(false)
  at.insertNode(span)
}

function findMarker(annotationId: string): HTMLElement | null {
  const escaped = CSS.escape(annotationId)
  return document.querySelector(
    `.${REVIEW_MARKER_CLASS}[data-annotation-id="${escaped}"]`,
  )
}

/**
 * Paints review-kind annotations onto the briefing in a teal treatment,
 * with a trailing marker icon per review and a hover state. Mirrors the
 * candidate-facing AnnotationsHighlightLayer but is scoped to a single kind
 * and palette so the two layers can coexist without clashing.
 */
export default function ReviewHighlightLayer({ annotations }: Props): null {
  const pathname = usePathname()
  const resolvedRef = useRef<ResolvedRange[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const CSSAny = CSS as unknown as {
      highlights?: {
        set(name: string, h: unknown): void
        delete(name: string): void
      }
    }
    const HighlightCtorMaybe = (
      window as unknown as {
        Highlight?: new (...ranges: Range[]) => unknown
      }
    ).Highlight
    if (!CSSAny.highlights || !HighlightCtorMaybe) return
    const HighlightCtor = HighlightCtorMaybe

    if (!document.getElementById(STYLE_TAG_ID)) {
      const tag = document.createElement('style')
      tag.id = STYLE_TAG_ID
      tag.textContent = STYLE_RULES
      document.head.appendChild(tag)
    }

    removeAllMarkers()

    const ranges: Range[] = []
    const resolved: ResolvedRange[] = []
    for (const a of annotations) {
      if (a.kind !== 'review') continue
      if (!a.jsonPath || a.start === null || a.end === null) continue
      const el = findAnchorEl(a.jsonPath)
      if (!el) continue
      const range = buildRangeIn(el, a.start, a.end)
      if (!range) continue
      ranges.push(range)
      resolved.push({ annotation: a, range })
      insertMarker(range, a.id)
    }

    resolvedRef.current = resolved

    if (ranges.length === 0) CSSAny.highlights.delete(HIGHLIGHT_NAME)
    else CSSAny.highlights.set(HIGHLIGHT_NAME, new HighlightCtor(...ranges))

    let hoveredId: string | null = null
    let hoveredMarker: HTMLElement | null = null
    let raf = 0
    let pendingX = 0
    let pendingY = 0

    function update() {
      raf = 0
      let nextId: string | null = null
      let nextRange: Range | null = null

      const elAtPoint = document.elementFromPoint(pendingX, pendingY)
      const markerEl = elAtPoint
        ? (elAtPoint.closest(MARKER_SELECTOR) as HTMLElement | null)
        : null
      if (markerEl?.dataset.annotationId) {
        const id = markerEl.dataset.annotationId
        const forIcon = resolvedRef.current.find((r) => r.annotation.id === id)
        if (forIcon) {
          nextId = id
          nextRange = forIcon.range
        }
      } else {
        const hit = pointToOffset(pendingX, pendingY)
        if (hit) {
          for (const { annotation, range } of resolvedRef.current) {
            if (annotation.jsonPath !== hit.jsonPath) continue
            if (annotation.start === null || annotation.end === null) continue
            if (hit.offset < annotation.start || hit.offset >= annotation.end)
              continue
            nextId = annotation.id
            nextRange = range
            break
          }
        }
      }

      if (nextId === hoveredId) return
      hoveredId = nextId

      if (hoveredMarker) {
        hoveredMarker.removeAttribute('data-hover')
        hoveredMarker = null
      }
      if (nextId) {
        const marker = findMarker(nextId)
        if (marker) {
          marker.setAttribute('data-hover', 'true')
          hoveredMarker = marker
        }
      }

      if (nextRange) {
        CSSAny.highlights?.set(HOVER_NAME, new HighlightCtor(nextRange))
        document.body.style.cursor = 'pointer'
      } else {
        CSSAny.highlights?.delete(HOVER_NAME)
        document.body.style.cursor = ''
      }
    }

    function onMove(e: MouseEvent) {
      pendingX = e.clientX
      pendingY = e.clientY
      if (raf === 0) raf = requestAnimationFrame(update)
    }

    document.addEventListener('mousemove', onMove)

    return () => {
      document.removeEventListener('mousemove', onMove)
      if (raf !== 0) cancelAnimationFrame(raf)
      CSSAny.highlights?.delete(HIGHLIGHT_NAME)
      CSSAny.highlights?.delete(HOVER_NAME)
      document.body.style.cursor = ''
      if (hoveredMarker) hoveredMarker.removeAttribute('data-hover')
      resolvedRef.current = []
      removeAllMarkers()
    }
  }, [annotations, pathname])

  return null
}
