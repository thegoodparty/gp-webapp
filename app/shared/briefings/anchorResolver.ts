/**
 * Anchor resolution for briefing text selections.
 *
 * Converts a browser `Selection` (or a `Range`) into an
 * `{ jsonPath, start, end, quote }` anchor by walking up to the nearest
 * element carrying a `data-briefing-json-path` attribute and computing
 * character offsets within that element's plain text.
 *
 * Conversely, builds a DOM `Range` inside a target element from
 * `{ jsonPath, start, end }` so existing annotations can be re-highlighted
 * on the page.
 */

import type { AnnotationAnchor } from './types'

const ANCHOR_ATTR = 'data-briefing-json-path'
const ANCHOR_SELECTOR = '[data-briefing-json-path]'

export interface ResolvedAnchor {
  jsonPath: string
  start: number
  end: number
  quote: string
  /** Bounding rect of the selection in viewport coordinates. */
  rect: DOMRect
}

/**
 * Walks up from a node to the closest element carrying the anchor attribute.
 */
function nearestAnchorEl(node: Node | null): HTMLElement | null {
  let el: Node | null = node
  while (el && el.nodeType !== Node.ELEMENT_NODE) {
    el = el.parentNode
  }
  if (!el) return null
  const found = (el as HTMLElement).closest(ANCHOR_SELECTOR)
  return found ? (found as HTMLElement) : null
}

/**
 * Character offset of a selection boundary within `container`'s plain text.
 * Returns -1 if `node` is not inside `container`.
 *
 * `node`/`nodeOffset` is a DOM boundary point. For a text node it's an offset
 * into the character data; for an element node it's a child index. Block-level
 * selections (triple-click, "select the whole line") set the boundary on the
 * element itself rather than a text node, so we measure with a Range — from
 * the container's start to the boundary — instead of walking text nodes (which
 * never match an element boundary and would return -1, dropping the toolbar).
 */
function textOffsetIn(container: Node, node: Node, nodeOffset: number): number {
  if (node !== container && !container.contains(node)) return -1
  const range = document.createRange()
  range.setStart(container, 0)
  try {
    range.setEnd(node, nodeOffset)
  } catch {
    return -1
  }
  return range.toString().length
}

export function resolveSelection(
  selection: Selection | null,
): ResolvedAnchor | null {
  if (!selection || selection.isCollapsed || selection.rangeCount === 0)
    return null
  const range = selection.getRangeAt(0)
  if (range.toString().trim().length === 0) return null

  // Anchor to the passage the selection STARTS in. Selecting to (or through)
  // the end of a paragraph routinely places the end boundary just past that
  // passage — on the enclosing card root or a trailing sibling node — so the
  // end's nearest anchor element differs from the start's. Rejecting on that
  // mismatch dropped every full-passage highlight (the toolbar only showed for
  // mid-passage selections). Instead, resolve against the start passage and
  // clamp the offsets to it.
  const anchorEl =
    nearestAnchorEl(range.startContainer) ?? nearestAnchorEl(range.endContainer)
  if (!anchorEl) return null

  const jsonPath = anchorEl.getAttribute(ANCHOR_ATTR)
  if (!jsonPath) return null

  const fullText = anchorEl.textContent ?? ''
  const start = anchorEl.contains(range.startContainer)
    ? textOffsetIn(anchorEl, range.startContainer, range.startOffset)
    : 0
  const end = anchorEl.contains(range.endContainer)
    ? textOffsetIn(anchorEl, range.endContainer, range.endOffset)
    : fullText.length
  if (start < 0 || end <= start) return null

  const quote = fullText.slice(start, end)
  if (quote.trim().length === 0) return null

  return { jsonPath, start, end, quote, rect: range.getBoundingClientRect() }
}

/**
 * Locate the text-bearing element for a given jsonPath in the current DOM.
 */
export function findAnchorEl(jsonPath: string): HTMLElement | null {
  // CSS.escape has been baseline since 2020 (Chrome 46+, Safari 10.1+,
  // Firefox 31+). No fallback needed.
  const escaped = CSS.escape(jsonPath)
  return document.querySelector(
    `[${ANCHOR_ATTR}="${escaped}"]`,
  ) as HTMLElement | null
}

/**
 * Convert a point in viewport coordinates into `{ jsonPath, offset }`
 * relative to the nearest text-anchored element. Returns null if the point
 * is not inside such an element. Uses `caretPositionFromPoint` (Firefox /
 * Chrome) or `caretRangeFromPoint` (older WebKit) for the underlying
 * conversion.
 */
export function pointToOffset(
  clientX: number,
  clientY: number,
): { jsonPath: string; offset: number } | null {
  if (typeof document === 'undefined') return null
  const elFromPoint = document.elementFromPoint(clientX, clientY)
  if (!elFromPoint) return null
  const anchorEl = (elFromPoint as Element).closest(
    ANCHOR_SELECTOR,
  ) as HTMLElement | null
  if (!anchorEl) return null
  const jsonPath = anchorEl.getAttribute(ANCHOR_ATTR)
  if (!jsonPath) return null

  type CaretPosition = { offsetNode: Node; offset: number }
  type DocWithCaret = Document & {
    caretPositionFromPoint?: (x: number, y: number) => CaretPosition | null
    caretRangeFromPoint?: (x: number, y: number) => Range | null
  }
  const doc = document as DocWithCaret
  let node: Node | null = null
  let nodeOffset = 0
  if (typeof doc.caretPositionFromPoint === 'function') {
    const pos = doc.caretPositionFromPoint(clientX, clientY)
    if (!pos) return null
    node = pos.offsetNode
    nodeOffset = pos.offset
  } else if (typeof doc.caretRangeFromPoint === 'function') {
    const range = doc.caretRangeFromPoint(clientX, clientY)
    if (!range) return null
    node = range.startContainer
    nodeOffset = range.startOffset
  } else {
    return null
  }
  const offset = textOffsetIn(anchorEl, node, nodeOffset)
  if (offset < 0) return null
  return { jsonPath, offset }
}

/**
 * Canonical "no anchor" sentinel — annotations that aren't pinned to a
 * specific passage (page-level chats, top-level notes). Reference-equal
 * across calls so consumers can use it as a stable prop.
 */
export const EMPTY_ANCHOR: AnnotationAnchor = Object.freeze({
  jsonPath: null,
  start: null,
  end: null,
}) as AnnotationAnchor

/**
 * True when a chat annotation is page-wide (unanchored to any passage).
 * Treats both null and empty-string `jsonPath` as unanchored — the schema
 * stores null, but the empty-string defense covers server-side drift so
 * the briefing-wide "Delete chat" guard can't be bypassed by a coerced
 * empty string. Consumers use this to hide destructive actions on the
 * primary assistant thread.
 */
export function isPageWideChat(annotation: {
  jsonPath: string | null
}): boolean {
  return annotation.jsonPath === null || annotation.jsonPath === ''
}

/**
 * Smooth-scroll the briefing canvas to an annotation's anchor. No-op when
 * the annotation has no anchor or the anchor's DOM node has been removed.
 *
 * Mobile path: when vaul's bottom Drawer is open, `body` has `overflow:
 * hidden` AND vaul registers global wheel/touchmove listeners. Under that
 * lock, `el.scrollIntoView()`, `window.scrollBy()`, AND
 * `window.scrollTo()` are all effectively no-ops. Direct
 * `documentElement.scrollTop = X` is the one mutation vaul doesn't
 * intercept, so we compute the absolute target scroll position (anchor
 * centered in the band above the drawer) and assign it.
 *
 * Desktop path: the right-side drawer doesn't lock body, so the standard
 * `scrollIntoView({ block: 'center' })` works fine.
 */
export function scrollAnchorIntoView(annotation: {
  jsonPath: string | null
}): void {
  if (typeof document === 'undefined') return
  if (!annotation.jsonPath) return
  const el = findAnchorEl(annotation.jsonPath)
  if (!el) return

  const bottomDrawer = document.querySelector(
    '[data-vaul-drawer-direction="bottom"][data-state="open"]',
  )
  if (bottomDrawer instanceof HTMLElement) {
    // Vaul applies `overflow: hidden` to body while the drawer is open.
    // Under that lock, `el.scrollIntoView()` and `window.scrollBy()` are
    // both no-ops — but `window.scrollTo()` (and direct
    // `documentElement.scrollTop = X`) still work. So we compute the
    // absolute document scroll position needed to land the anchor centered
    // in the visible band above the drawer, then `scrollTo` to it.
    const drawerRect = bottomDrawer.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const targetViewportTop = Math.max(
      0,
      drawerRect.top / 2 - elRect.height / 2,
    )
    const elDocY = elRect.top + document.documentElement.scrollTop
    const newScrollTop = Math.max(0, elDocY - targetViewportTop)
    // Vaul's modal Drawer registers global wheel/touchmove listeners that
    // swallow `scrollTo({behavior:'smooth'})` and `scrollIntoView`. Direct
    // scrollTop assignment bypasses those listeners. Instant jump — we
    // tried `scroll-behavior: smooth` to get the animation back, but it
    // re-triggers the same vaul interception, so we keep the jump.
    document.documentElement.scrollTop = newScrollTop
    return
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export type AnchorElementLookup = (jsonPath: string) => HTMLElement | null

/**
 * Reconstruct the highlighted quote from an annotation's anchor by walking
 * the live DOM. Returns null when the anchor is incomplete, the DOM has no
 * matching element, or the resolved range is empty.
 *
 * `lookup` defaults to `findAnchorEl`; callers iterating over many
 * annotations should pass a cached lookup (e.g. a Map keyed by jsonPath)
 * to avoid N querySelectorAll calls.
 */
export function resolveAnnotationHighlight(
  annotation: AnnotationAnchor,
  lookup: AnchorElementLookup = findAnchorEl,
): string | null {
  if (typeof document === 'undefined') return null
  const { jsonPath, start, end } = annotation
  if (jsonPath === null || start === null || end === null) return null
  const el = lookup(jsonPath)
  if (!el) return null
  const range = buildRangeIn(el, start, end)
  if (!range) return null
  const quote = range.toString().trim()
  return quote.length > 0 ? quote : null
}

/**
 * Build a Range covering text offsets `[start, end)` inside `container`.
 * Returns null if the offsets are out of bounds.
 */
export function buildRangeIn(
  container: HTMLElement,
  start: number,
  end: number,
): Range | null {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  let cur: Node | null = walker.nextNode()
  let pos = 0
  let startNode: Node | null = null
  let startOffset = 0
  let endNode: Node | null = null
  let endOffset = 0

  while (cur) {
    const len = cur.textContent?.length ?? 0
    const nextPos = pos + len
    if (startNode === null && start >= pos && start <= nextPos) {
      startNode = cur
      startOffset = start - pos
    }
    if (endNode === null && end >= pos && end <= nextPos) {
      endNode = cur
      endOffset = end - pos
      break
    }
    pos = nextPos
    cur = walker.nextNode()
  }
  if (!startNode || !endNode) return null
  const range = document.createRange()
  range.setStart(startNode, startOffset)
  range.setEnd(endNode, endOffset)
  return range
}

/**
 * Read the highlighted text for an existing annotation by walking the live
 * DOM. The server doesn't persist the original quote — it's rebuilt on
 * demand from the stored `jsonPath` + start/end offsets so the briefing
 * UI can show the anchored passage without round-tripping.
 *
 * Returns null when the annotation has no anchor (top-level note) or when
 * the DOM no longer matches (e.g. content changed since the note was
 * written) or when we're in an SSR / non-browser context.
 */
export function resolveQuoteFromAnchor(anchor: {
  jsonPath: string | null
  start: number | null
  end: number | null
}): string | null {
  if (typeof document === 'undefined') return null
  const { jsonPath, start, end } = anchor
  if (jsonPath === null || start === null || end === null) return null
  const el = findAnchorEl(jsonPath)
  if (!el) return null
  const range = buildRangeIn(el, start, end)
  if (!range) return null
  const quote = range.toString().trim()
  return quote.length > 0 ? quote : null
}
