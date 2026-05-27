import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EMPTY_ANCHOR, scrollAnchorIntoView } from './anchorResolver'

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
      } as DOMRect)
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
      } as DOMRect)
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
