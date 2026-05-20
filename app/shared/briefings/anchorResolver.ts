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
 * Character offset of the first character of `node` within
 * `container.textContent`. Returns -1 if `node` is not inside `container`.
 */
function textOffsetIn(container: Node, node: Node, nodeOffset: number): number {
  if (!container.contains(node)) return -1
  let offset = 0
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  let cur: Node | null = walker.nextNode()
  while (cur) {
    if (cur === node) return offset + nodeOffset
    offset += cur.textContent?.length ?? 0
    cur = walker.nextNode()
  }
  return -1
}

export function resolveSelection(
  selection: Selection | null,
): ResolvedAnchor | null {
  if (!selection || selection.isCollapsed || selection.rangeCount === 0)
    return null
  const range = selection.getRangeAt(0)
  const quote = range.toString()
  if (quote.trim().length === 0) return null

  const startEl = nearestAnchorEl(range.startContainer)
  const endEl = nearestAnchorEl(range.endContainer)
  if (!startEl || startEl !== endEl) return null // selection crosses sections; skip

  const jsonPath = startEl.getAttribute(ANCHOR_ATTR)
  if (!jsonPath) return null

  const start = textOffsetIn(startEl, range.startContainer, range.startOffset)
  const end = textOffsetIn(startEl, range.endContainer, range.endOffset)
  if (start < 0 || end <= start) return null

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
