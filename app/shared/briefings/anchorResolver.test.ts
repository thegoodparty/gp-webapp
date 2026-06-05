import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  EMPTY_ANCHOR,
  resolveSelection,
  scrollAnchorIntoView,
  selectElementContents,
} from './anchorResolver'

describe('selectElementContents', () => {
  it('makes the element’s full text the document selection', () => {
    document.body.innerHTML =
      '<h3 data-briefing-json-path="/items/0/title">My Title</h3>'
    const h3 = document.querySelector('h3') as HTMLElement
    const removeAllRanges = vi.fn()
    const addRange = vi.fn()
    const spy = vi
      .spyOn(window, 'getSelection')
      .mockReturnValue({ removeAllRanges, addRange } as unknown as Selection)

    selectElementContents(h3)

    expect(removeAllRanges).toHaveBeenCalledOnce()
    expect(addRange).toHaveBeenCalledOnce()
    const range = addRange.mock.calls[0]?.[0] as Range
    expect(range.toString()).toBe('My Title')
    spy.mockRestore()
  })
})

describe('resolveSelection', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  // resolveSelection only reads isCollapsed / rangeCount / getRangeAt, so a
  // real jsdom Range wrapped in this stub exercises the offset math without
  // depending on jsdom's partial window.getSelection() implementation.
  const asSelection = (range: Range): Selection =>
    ({
      isCollapsed: range.collapsed,
      rangeCount: 1,
      getRangeAt: () => range,
    }) as unknown as Selection

  const rangeBetween = (start: [Node, number], end: [Node, number]): Range => {
    const range = document.createRange()
    range.setStart(start[0], start[1])
    range.setEnd(end[0], end[1])
    // jsdom Range has no layout; resolveSelection only stores the rect.
    range.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect
    return range
  }

  it('resolves a text-node selection (drag / double-click word)', () => {
    document.body.innerHTML =
      '<ul><li data-briefing-json-path="/items/0/talking_points/0">hello world</li></ul>'
    const text = document.querySelector('li')?.firstChild as Node
    const anchor = resolveSelection(
      asSelection(rangeBetween([text, 0], [text, 11])),
    )
    expect(anchor).toMatchObject({
      jsonPath: '/items/0/talking_points/0',
      start: 0,
      end: 11,
      quote: 'hello world',
    })
  })

  it('resolves a block selection whose boundary is the element node (triple-click / full-highlight)', () => {
    document.body.innerHTML =
      '<ul><li data-briefing-json-path="/items/0/talking_points/0">hello world</li></ul>'
    const li = document.querySelector('li') as HTMLElement
    // Block selections set the boundary on the element itself (child index),
    // not a text node: start before child 0, end after child 0.
    const anchor = resolveSelection(asSelection(rangeBetween([li, 0], [li, 1])))
    expect(anchor).toMatchObject({
      jsonPath: '/items/0/talking_points/0',
      start: 0,
      end: 11,
    })
  })

  it('clamps to the start passage when the end boundary spills past it (full-passage highlight)', () => {
    // Mirrors the real DOM: a passage <p> inside a card root, followed by a
    // trailing sibling. Selecting to the end of the passage lands the end
    // boundary on that sibling, whose nearest anchor is the card — not the
    // passage. We must still resolve against the passage.
    document.body.innerHTML =
      '<article data-briefing-json-path="/items/1">' +
      '<p data-briefing-json-path="/items/1/display/summary">hello world</p>' +
      '<span>source</span>' +
      '</article>'
    const summaryText = document.querySelector('p')?.firstChild as Node
    const trailing = document.querySelector('span')?.firstChild as Node
    const anchor = resolveSelection(
      asSelection(rangeBetween([summaryText, 0], [trailing, 3])),
    )
    expect(anchor).toMatchObject({
      jsonPath: '/items/1/display/summary',
      start: 0,
      end: 11,
      quote: 'hello world',
    })
  })

  it('resolves via endContainer when startContainer has no anchor ancestor', () => {
    // Selection begins in non-anchored chrome and ends inside a passage. The
    // start is necessarily before the passage in document order, so clamping
    // start to 0 captures exactly the in-passage slice (not wrong text).
    document.body.innerHTML =
      '<div>' +
      '<span>preamble </span>' +
      '<p data-briefing-json-path="/items/2/body">hello world</p>' +
      '</div>'
    const preamble = document.querySelector('span')?.firstChild as Node
    const bodyText = document.querySelector('p')?.firstChild as Node
    const anchor = resolveSelection(
      asSelection(rangeBetween([preamble, 0], [bodyText, 5])),
    )
    expect(anchor).toMatchObject({
      jsonPath: '/items/2/body',
      start: 0,
      end: 5,
      quote: 'hello',
    })
  })

  it('returns null when neither startContainer nor endContainer has an anchor ancestor', () => {
    document.body.innerHTML = '<span>no anchor here</span>'
    const text = document.querySelector('span')?.firstChild as Node
    expect(
      resolveSelection(asSelection(rangeBetween([text, 0], [text, 8]))),
    ).toBeNull()
  })

  it('returns null for a collapsed selection', () => {
    document.body.innerHTML = '<li data-briefing-json-path="/x">hello</li>'
    const text = document.querySelector('li')?.firstChild as Node
    expect(
      resolveSelection(asSelection(rangeBetween([text, 2], [text, 2]))),
    ).toBeNull()
  })
})

describe('EMPTY_ANCHOR', () => {
  it('is frozen so consumers cannot mutate the shared sentinel', () => {
    expect(Object.isFrozen(EMPTY_ANCHOR)).toBe(true)
    expect(() => {
      EMPTY_ANCHOR.jsonPath = 'evil'
    }).toThrow()
  })
})

describe('scrollAnchorIntoView', () => {
  const originalScrollIntoView = Element.prototype.scrollIntoView
  let scrollIntoViewSpy: ReturnType<typeof vi.fn<Element['scrollIntoView']>>

  beforeEach(() => {
    document.body.innerHTML = ''
    scrollIntoViewSpy = vi.fn<Element['scrollIntoView']>()
    Element.prototype.scrollIntoView = scrollIntoViewSpy
    document.documentElement.scrollTop = 0
  })

  afterEach(() => {
    Element.prototype.scrollIntoView = originalScrollIntoView
  })

  function makeAnchorEl(jsonPath: string, rect: Partial<DOMRect>): HTMLElement {
    const el = document.createElement('div')
    el.setAttribute('data-briefing-json-path', jsonPath)
    document.body.appendChild(el)
    el.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
        ...rect,
      }) as DOMRect
    return el
  }

  function makeBottomDrawer(rect: Partial<DOMRect>): HTMLElement {
    const drawer = document.createElement('div')
    drawer.setAttribute('data-vaul-drawer-direction', 'bottom')
    drawer.setAttribute('data-state', 'open')
    document.body.appendChild(drawer)
    drawer.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
        ...rect,
      }) as DOMRect
    return drawer
  }

  it('uses scrollIntoView centered when no bottom drawer is open (desktop / right drawer)', () => {
    makeAnchorEl('path.a', { top: 500, height: 40 })

    scrollAnchorIntoView({ jsonPath: 'path.a' })

    expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1)
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    })
    expect(document.documentElement.scrollTop).toBe(0)
  })

  it('directly assigns documentElement.scrollTop when a bottom drawer is open — scrollIntoView/scrollTo are no-ops against vaul body lock + listeners', () => {
    // Drawer band: visible 0..200, band center 100, anchor center should
    // land at 100 → anchor top at y=80.
    makeBottomDrawer({ top: 200, height: 568 })
    // Anchor 200px below current viewport, page scrolled to 500.
    // elDocY = 200 + 500 = 700; targetViewportTop = 80; new = 620.
    document.documentElement.scrollTop = 500
    makeAnchorEl('path.a', { top: 200, height: 40 })

    scrollAnchorIntoView({ jsonPath: 'path.a' })

    expect(document.documentElement.scrollTop).toBe(620)
    expect(scrollIntoViewSpy).not.toHaveBeenCalled()
  })

  it('clamps newScrollTop to 0 when the anchor is near the top of the document', () => {
    makeBottomDrawer({ top: 200, height: 568 })
    document.documentElement.scrollTop = 0
    makeAnchorEl('path.a', { top: 0, height: 40 })

    scrollAnchorIntoView({ jsonPath: 'path.a' })

    expect(document.documentElement.scrollTop).toBe(0)
  })

  it('clamps targetViewportTop to 0 when the anchor is taller than the visible band — the anchor lands at viewport top', () => {
    // Visible band: 0..100 (drawer top at 100). Anchor height: 400 (taller
    // than the band). drawerRect.top/2 - elRect.height/2 = 50 - 200 = -150,
    // which clamps to 0. So newScrollTop = elDocY - 0 = elDocY.
    makeBottomDrawer({ top: 100, height: 668 })
    document.documentElement.scrollTop = 1000
    makeAnchorEl('path.a', { top: 500, height: 400 })
    // elDocY = 500 + 1000 = 1500

    scrollAnchorIntoView({ jsonPath: 'path.a' })

    expect(document.documentElement.scrollTop).toBe(1500)
  })

  it('does nothing when the anchor element is missing from the DOM', () => {
    document.documentElement.scrollTop = 500

    scrollAnchorIntoView({ jsonPath: 'path.missing' })

    expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    expect(document.documentElement.scrollTop).toBe(500)
  })

  it('ignores closed bottom drawers and falls through to scrollIntoView', () => {
    const drawer = document.createElement('div')
    drawer.setAttribute('data-vaul-drawer-direction', 'bottom')
    drawer.setAttribute('data-state', 'closed')
    document.body.appendChild(drawer)
    document.documentElement.scrollTop = 200
    makeAnchorEl('path.a', { top: 100, height: 40 })

    scrollAnchorIntoView({ jsonPath: 'path.a' })

    expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1)
    expect(document.documentElement.scrollTop).toBe(200)
  })
})
