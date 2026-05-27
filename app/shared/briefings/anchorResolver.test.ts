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
  const originalScrollBy = window.scrollBy
  let scrollIntoViewSpy: ReturnType<typeof vi.fn>
  let scrollBySpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    document.body.innerHTML = ''
    scrollIntoViewSpy = vi.fn()
    scrollBySpy = vi.fn()
    Element.prototype.scrollIntoView =
      scrollIntoViewSpy as unknown as Element['scrollIntoView']
    window.scrollBy = scrollBySpy as unknown as typeof window.scrollBy
  })

  afterEach(() => {
    Element.prototype.scrollIntoView = originalScrollIntoView
    window.scrollBy = originalScrollBy
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
    expect(scrollBySpy).not.toHaveBeenCalled()
  })

  it('scrolls the anchor into the visible band above an open bottom drawer (mobile)', () => {
    // Drawer occupies the bottom of the viewport; the visible band above
    // the drawer goes from y=0 to y=200. Band center is y=100.
    makeBottomDrawer({ top: 200, height: 568 })
    // Anchor's current viewport position: center at y=500 (top=480, height=40).
    makeAnchorEl('path.a', { top: 480, height: 40 })

    scrollAnchorIntoView({ jsonPath: 'path.a' })

    // To move anchor center from y=500 to y=100, scroll document down by 400.
    expect(scrollBySpy).toHaveBeenCalledTimes(1)
    expect(scrollBySpy).toHaveBeenCalledWith({ top: 400, behavior: 'smooth' })
    expect(scrollIntoViewSpy).not.toHaveBeenCalled()
  })

  it('does nothing when the anchor element is missing from the DOM', () => {
    scrollAnchorIntoView({ jsonPath: 'path.missing' })

    expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    expect(scrollBySpy).not.toHaveBeenCalled()
  })

  it('ignores closed bottom drawers and falls through to scrollIntoView', () => {
    const drawer = document.createElement('div')
    drawer.setAttribute('data-vaul-drawer-direction', 'bottom')
    drawer.setAttribute('data-state', 'closed')
    document.body.appendChild(drawer)
    makeAnchorEl('path.a', { top: 100, height: 40 })

    scrollAnchorIntoView({ jsonPath: 'path.a' })

    expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1)
    expect(scrollBySpy).not.toHaveBeenCalled()
  })
})
