import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnnotationSurfaceSheet } from './AnnotationSurfaceSheet'
import type { EnrichedAnnotation } from './enrichForCycler'

vi.mock('@styleguide/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

const mockFindAnchorEl = vi.fn<(jsonPath: string) => HTMLElement | null>()
const mockScrollAnchorIntoView =
  vi.fn<(annotation: { jsonPath: string | null }) => void>()

vi.mock('@shared/briefings/anchorResolver', () => ({
  findAnchorEl: (jsonPath: string) => mockFindAnchorEl(jsonPath),
  scrollAnchorIntoView: (annotation: { jsonPath: string | null }) =>
    mockScrollAnchorIntoView(annotation),
}))

function makeItem(
  id: string,
  overrides: Partial<EnrichedAnnotation> = {},
): EnrichedAnnotation {
  return {
    id,
    kind: 'note',
    resourceType: 'briefing',
    resourceId: 'briefing_1',
    authorUserId: 1,
    jsonPath: `path.${id}`,
    start: 0,
    end: 5,
    createdAt: '2026-05-26T00:00:00.000Z',
    updatedAt: '2026-05-26T00:00:00.000Z',
    docOrderIndex: null,
    highlightedText: null,
    ...overrides,
  }
}

const renderItem = (item: EnrichedAnnotation) => (
  <div data-testid="surface-item">{item.id}</div>
)

beforeEach(() => {
  mockFindAnchorEl.mockReset()
  mockScrollAnchorIntoView.mockReset()
})

describe('<AnnotationSurfaceSheet>', () => {
  it('selects the annotation matching initialAnnotationId on first render', () => {
    const items = [makeItem('a'), makeItem('b'), makeItem('c')]
    render(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={items}
        renderItem={renderItem}
        initialAnnotationId="b"
      />,
    )
    expect(screen.getByTestId('surface-item')).toHaveTextContent('b')
  })

  it('resets selection to the new initialAnnotationId when reopened', () => {
    const items = [makeItem('a'), makeItem('b'), makeItem('c')]
    const { rerender } = render(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={items}
        renderItem={renderItem}
        initialAnnotationId="b"
      />,
    )
    expect(screen.getByTestId('surface-item')).toHaveTextContent('b')

    rerender(
      <AnnotationSurfaceSheet
        open={false}
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={items}
        renderItem={renderItem}
        initialAnnotationId="b"
      />,
    )

    rerender(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={items}
        renderItem={renderItem}
        initialAnnotationId="c"
      />,
    )

    expect(screen.getByTestId('surface-item')).toHaveTextContent('c')
  })

  it('scrolls the anchor into view on cycler advance', async () => {
    const user = userEvent.setup()
    const items = [
      makeItem('a', { jsonPath: 'path.a' }),
      makeItem('b', { jsonPath: 'path.b' }),
    ]

    render(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={items}
        renderItem={renderItem}
        initialAnnotationId="a"
      />,
    )

    // Initial open already scrolled to "a"; clear so the advance assertion
    // only sees activity from clicking next.
    mockScrollAnchorIntoView.mockClear()

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(mockScrollAnchorIntoView).toHaveBeenCalledTimes(1)
    expect(mockScrollAnchorIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'b', jsonPath: 'path.b' }),
    )
  })

  it('scrolls the initial anchor into view exactly once when the surface opens with an anchored target', () => {
    const items = [
      makeItem('a', { jsonPath: 'path.a' }),
      makeItem('b', { jsonPath: 'path.b' }),
    ]

    render(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={items}
        renderItem={renderItem}
        initialAnnotationId="b"
      />,
    )

    expect(mockScrollAnchorIntoView).toHaveBeenCalledTimes(1)
    expect(mockScrollAnchorIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'b', jsonPath: 'path.b' }),
    )
  })

  it('does not re-scroll on a subsequent items prop change after the surface is already open', () => {
    const initialItems = [
      makeItem('a', { jsonPath: 'path.a' }),
      makeItem('b', { jsonPath: 'path.b' }),
    ]

    const { rerender } = render(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={initialItems}
        renderItem={renderItem}
        initialAnnotationId="b"
      />,
    )

    expect(mockScrollAnchorIntoView).toHaveBeenCalledTimes(1)
    expect(mockScrollAnchorIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'b' }),
    )
    mockScrollAnchorIntoView.mockClear()

    // New array reference, same logical items — simulates a refetch.
    const refetchedItems = [
      makeItem('a', { jsonPath: 'path.a' }),
      makeItem('b', { jsonPath: 'path.b' }),
    ]
    rerender(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={refetchedItems}
        renderItem={renderItem}
        initialAnnotationId="b"
      />,
    )

    expect(mockScrollAnchorIntoView).not.toHaveBeenCalled()
  })

  it('falls back to the first surviving item when the selected item is removed, passing the new current to the footer', () => {
    const a = makeItem('a')
    const b = makeItem('b')
    const c = makeItem('c')

    const footerCalls: Array<EnrichedAnnotation | null> = []
    const footer = (item: EnrichedAnnotation | null) => {
      footerCalls.push(item)
      return <div data-testid="footer">{item ? item.id : 'null'}</div>
    }

    const { rerender } = render(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={[a, b, c]}
        renderItem={renderItem}
        footer={footer}
        initialAnnotationId="b"
      />,
    )
    expect(screen.getByTestId('surface-item')).toHaveTextContent('b')
    // Pre-rerender baseline: footer was called with the matching annotation.
    expect(footerCalls.at(-1)).toEqual(expect.objectContaining({ id: 'b' }))
    footerCalls.length = 0

    rerender(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={[a, c]}
        renderItem={renderItem}
        footer={footer}
        initialAnnotationId="b"
      />,
    )

    // After the fallback runs, the surface displays 'a' and the footer is
    // called with the new current annotation.
    expect(screen.getByTestId('surface-item')).toHaveTextContent('a')
    expect(footerCalls.at(-1)).toEqual(expect.objectContaining({ id: 'a' }))
  })

  it('binds selection to a new initialAnnotationId that arrives after the surface is already open (no reopen)', () => {
    // Scenario: surface opens with no initialAnnotationId (e.g. a
    // pending-anchor preempt state in BriefingAssistantSurface). Then the
    // newly-minted chat hands off — parent re-renders with the new id while
    // the surface stays open. The cycler must land on the new annotation,
    // not stay on items[0].
    const items = [
      makeItem('a'),
      makeItem('b'),
      makeItem('c'),
      makeItem('d'),
    ]

    const { rerender } = render(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={items}
        renderItem={renderItem}
        // No initialAnnotationId on first render — selection starts on items[0].
      />,
    )
    expect(screen.getByTestId('surface-item')).toHaveTextContent('a')

    // Parent re-renders with a specific initialAnnotationId while open.
    rerender(
      <AnnotationSurfaceSheet
        open
        onClose={vi.fn()}
        title="Notes"
        subtitle="sub"
        items={items}
        renderItem={renderItem}
        initialAnnotationId="c"
      />,
    )

    // Without the rebind, this asserts 'a' (first-open ref gated re-fire);
    // with the rebind, it correctly snaps to 'c'.
    expect(screen.getByTestId('surface-item')).toHaveTextContent('c')
  })
})
