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

const HIGHLIGHT_NAMES: Record<MarkerKind, string> = {
  note: 'briefing-annotation-note',
  chat: 'briefing-annotation-chat',
  bug_report: 'briefing-annotation-bug',
}
const HOVER_NAME = 'briefing-annotation-hover'
const NOTE_MARKER_CLASS = 'briefing-note-marker'
const CHAT_MARKER_CLASS = 'briefing-chat-marker'
const BUG_MARKER_CLASS = 'briefing-bug-marker'
const STYLE_TAG_ID = 'briefing-annotation-highlight-style'

/**
 * Pseudo-element rules are injected at runtime because Lightningcss
 * (Turbopack's CSS parser) currently rejects `::highlight()`. Once it
 * supports the spec, move these into globals.css.
 *
 * Each highlight kind has its own visual treatment:
 *   - note      → blue tint background + a notebook icon at the end
 *   - chat      → no background; rendered as a hyperlink (colored + underlined)
 *   - bug_report → red tint background + line-through + bug icon at the end
 *
 * Marker hover state is driven via a `data-hover` attribute synced from the
 * same mousemove handler that paints the hover highlight, so the icon and
 * its text highlight darken together whichever one the user points at.
 */
const STYLE_RULES = `
/* Suppress the OS text-selection callout (iOS Safari's Copy / Look Up /
   Share menu, the native long-press handler) on annotation-enabled
   passages so only the briefing's HighlightToolbar surfaces on
   selection. We still allow selection itself — the toolbar reads the
   live selection — and the callout suppression is iOS-specific, which
   is where the conflict is most visible. */
[data-anchor-json-path] {
  -webkit-touch-callout: none;
}
::highlight(${HIGHLIGHT_NAMES.note}) {
  background-color: color-mix(in srgb, var(--info, #1b6afc) 22%, transparent);
  color: inherit;
}
::highlight(${HIGHLIGHT_NAMES.chat}) {
  /* Ask AI annotations render as hyperlinks rather than highlighted text. */
  color: var(--info, #1b6afc);
  text-decoration: underline dotted;
  text-decoration-color: color-mix(in srgb, var(--info, #1b6afc) 60%, transparent);
  text-underline-offset: 0.15em;
}
::highlight(${HIGHLIGHT_NAMES.bug_report}) {
  background-color: color-mix(in srgb, var(--error, #e00c30) 20%, transparent);
  color: inherit;
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, var(--error, #e00c30) 75%, transparent);
}
::highlight(${HOVER_NAME}) {
  background-color: color-mix(in srgb, var(--foreground, #161f31) 12%, transparent);
}
.${NOTE_MARKER_CLASS},
.${CHAT_MARKER_CLASS},
.${BUG_MARKER_CLASS} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Match the rectangle that ::highlight() paints, which is roughly the
     font's ascent + descent — between 1em and 1lh in practice. */
  height: 1.27em;
  /* vertical-align middle centers on the x-height midline, but the
     painted highlight is centered on the em box, which sits a touch
     higher. Nudge up so the icon aligns with the highlight rectangle. */
  vertical-align: middle;
  position: relative;
  top: -0.13em;
  margin: 0 4px 0 0;
  padding: 0 4px;
  cursor: pointer;
  /* Atomic: the icon is part of the annotation, not a separate selectable
     token. Selection skips it; copy doesn't include it. */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}
.${NOTE_MARKER_CLASS} {
  background-color: color-mix(in srgb, var(--info, #1b6afc) 22%, transparent);
  color: var(--info, #1b6afc);
}
.${CHAT_MARKER_CLASS} {
  /* Chat annotations render as hyperlinks, not highlighted spans — so the
     marker matches: no background pill, just the Sparkles icon in the same
     info color as the underlined text. */
  background-color: transparent;
  color: var(--info, #1b6afc);
}
.${BUG_MARKER_CLASS} {
  background-color: color-mix(in srgb, var(--error, #e00c30) 20%, transparent);
  color: var(--error, #e00c30);
}
.${NOTE_MARKER_CLASS} svg,
.${CHAT_MARKER_CLASS} svg,
.${BUG_MARKER_CLASS} svg {
  display: block;
  width: 14px;
  height: 14px;
  pointer-events: none;
}
.${NOTE_MARKER_CLASS}[data-hover='true'] {
  background-color: color-mix(in srgb, var(--info, #1b6afc) 32%, transparent);
  color: color-mix(in srgb, var(--info, #1b6afc) 80%, black);
}
.${CHAT_MARKER_CLASS}[data-hover='true'] {
  color: color-mix(in srgb, var(--info, #1b6afc) 80%, black);
}
.${BUG_MARKER_CLASS}[data-hover='true'] {
  background-color: color-mix(in srgb, var(--error, #e00c30) 30%, transparent);
  color: color-mix(in srgb, var(--error, #e00c30) 80%, black);
}
`

const BUG_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>`
// Lucide MessageSquare — same chat-bubble icon used by the Add Notes
// buttons in the header, mobile bottom bar, and HighlightToolbar.
const NOTE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
// Lucide Sparkles — same icon the Ask AI header button uses, so chat
// annotations carry the same visual "AI" cue everywhere in the briefing.
const CHAT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`

const MARKER_SELECTOR = `.${NOTE_MARKER_CLASS}[data-annotation-id], .${CHAT_MARKER_CLASS}[data-annotation-id], .${BUG_MARKER_CLASS}[data-annotation-id]`

type MarkerKind = 'note' | 'chat' | 'bug_report'

const MARKER_CLASS_FOR_KIND: Record<MarkerKind, string> = {
  note: NOTE_MARKER_CLASS,
  chat: CHAT_MARKER_CLASS,
  bug_report: BUG_MARKER_CLASS,
}

const MARKER_ICON_FOR_KIND: Record<MarkerKind, string> = {
  note: NOTE_ICON_SVG,
  chat: CHAT_ICON_SVG,
  bug_report: BUG_ICON_SVG,
}

const MARKER_ARIA_LABEL_FOR_KIND: Record<MarkerKind, string> = {
  note: 'Open note',
  chat: 'Open chat',
  bug_report: 'Open bug report',
}

function removeAllMarkers() {
  if (typeof document === 'undefined') return
  const nodes = document.querySelectorAll(
    `.${NOTE_MARKER_CLASS}, .${CHAT_MARKER_CLASS}, .${BUG_MARKER_CLASS}`,
  )
  for (const n of Array.from(nodes)) n.remove()
}

function insertMarker(range: Range, annotationId: string, kind: MarkerKind) {
  const span = document.createElement('span')
  span.className = MARKER_CLASS_FOR_KIND[kind]
  span.dataset.annotationId = annotationId
  span.setAttribute('contenteditable', 'false')
  span.setAttribute('aria-label', MARKER_ARIA_LABEL_FOR_KIND[kind])
  span.innerHTML = MARKER_ICON_FOR_KIND[kind]
  const at = range.cloneRange()
  at.collapse(false)
  at.insertNode(span)
}

function findMarker(annotationId: string): HTMLElement | null {
  const escaped = CSS.escape(annotationId)
  return document.querySelector(
    `.${NOTE_MARKER_CLASS}[data-annotation-id="${escaped}"], .${CHAT_MARKER_CLASS}[data-annotation-id="${escaped}"], .${BUG_MARKER_CLASS}[data-annotation-id="${escaped}"]`,
  )
}

export default function AnnotationsHighlightLayer({
  annotations,
}: Props): null {
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

    const rangesByKind: Record<MarkerKind, Range[]> = {
      note: [],
      chat: [],
      bug_report: [],
    }
    const resolved: ResolvedRange[] = []

    for (const a of annotations) {
      // Review annotations are painted by the admin-review layer, not this
      // candidate-facing one — skip them here.
      if (a.kind === 'review') continue
      if (!a.jsonPath || a.start === null || a.end === null) continue
      const el = findAnchorEl(a.jsonPath)
      if (!el) continue
      const range = buildRangeIn(el, a.start, a.end)
      if (!range) continue
      rangesByKind[a.kind].push(range)
      resolved.push({ annotation: a, range })

      // Every annotation kind gets an inline marker icon at the end of its
      // range — notebook for notes, sparkles for AI chats, bug for bug
      // reports. The marker is the click target the scope handler listens
      // to.
      insertMarker(range, a.id, a.kind)
    }

    resolvedRef.current = resolved

    const kinds: MarkerKind[] = ['note', 'chat', 'bug_report']
    for (const k of kinds) {
      const ranges = rangesByKind[k]
      const name = HIGHLIGHT_NAMES[k]
      if (ranges.length === 0) CSSAny.highlights.delete(name)
      else CSSAny.highlights.set(name, new HighlightCtor(...ranges))
    }

    // Hover state. The mouse can be over either the highlighted text or
    // an inline marker icon (note or bug) — both should count as hovering
    // the same annotation. We sync the marker's `data-hover` so its
    // background darkens together with the text highlight.
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
        const resolvedForIcon = resolvedRef.current.find(
          (r) => r.annotation.id === id,
        )
        if (resolvedForIcon) {
          nextId = id
          nextRange = resolvedForIcon.range
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

      // Sync icon hover state (relevant for both note and bug markers).
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
      for (const k of kinds) CSSAny.highlights?.delete(HIGHLIGHT_NAMES[k])
      CSSAny.highlights?.delete(HOVER_NAME)
      document.body.style.cursor = ''
      if (hoveredMarker) hoveredMarker.removeAttribute('data-hover')
      resolvedRef.current = []
      removeAllMarkers()
    }
  }, [annotations, pathname])

  return null
}
