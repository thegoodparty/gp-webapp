import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { AnnotationCycler } from './AnnotationCycler'

vi.mock('@styleguide/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

import { useIsMobile } from '@styleguide/hooks/use-mobile'
const mockedUseIsMobile = vi.mocked(useIsMobile)

type Fixture = { id: string; label: string }

const fixtures: Fixture[] = [
  { id: 'a', label: 'First' },
  { id: 'b', label: 'Second' },
  { id: 'c', label: 'Third' },
]

function Harness({
  items = fixtures,
  initial = 0,
  footer,
  emptyState,
}: {
  items?: Fixture[]
  initial?: number
  footer?: React.ReactNode
  emptyState?: React.ReactNode
}) {
  const [idx, setIdx] = useState(initial)
  return (
    <AnnotationCycler
      title="My surface"
      subtitle="Subtitle text"
      items={items}
      currentIndex={idx}
      onIndexChange={setIdx}
      renderItem={(item) => <div data-testid="item">{item.label}</div>}
      getKey={(item) => item.id}
      footer={footer}
      emptyState={emptyState}
    />
  )
}

describe('AnnotationCycler', () => {
  it('renders the title and subtitle', () => {
    render(<Harness />)
    expect(screen.getByText('My surface')).toBeInTheDocument()
    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })

  it('shows the current position as "1 of 3" at the start', () => {
    render(<Harness />)
    expect(screen.getByText(/1 of 3/i)).toBeInTheDocument()
  })

  it('renders the current item via renderItem', () => {
    render(<Harness initial={1} />)
    expect(screen.getByTestId('item')).toHaveTextContent('Second')
  })

  it('advances to the next item when next is clicked', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByTestId('item')).toHaveTextContent('Second')
    expect(screen.getByText(/2 of 3/i)).toBeInTheDocument()
  })

  it('goes back when prev is clicked', async () => {
    const user = userEvent.setup()
    render(<Harness initial={2} />)
    await user.click(screen.getByRole('button', { name: /previous/i }))
    expect(screen.getByTestId('item')).toHaveTextContent('Second')
  })

  it('disables prev on the first item', () => {
    render(<Harness initial={0} />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })

  it('disables next on the last item', () => {
    render(<Harness initial={fixtures.length - 1} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('renders the footer slot when provided', () => {
    render(<Harness footer={<div data-testid="footer">footer here</div>} />)
    expect(screen.getByTestId('footer')).toHaveTextContent('footer here')
  })

  it('renders an empty state when items is empty', () => {
    render(<Harness items={[]} emptyState={<div>nothing here yet</div>} />)
    expect(screen.getByText('nothing here yet')).toBeInTheDocument()
    expect(screen.queryByTestId('item')).not.toBeInTheDocument()
  })

  it('does not render the cycler control when empty', () => {
    render(<Harness items={[]} />)
    expect(
      screen.queryByRole('button', { name: /next/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /previous/i }),
    ).not.toBeInTheDocument()
  })

  it('advances on ArrowRight and goes back on ArrowLeft keypress', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const region = screen.getByRole('region', { name: /annotation cycler/i })
    region.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByTestId('item')).toHaveTextContent('Second')
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByTestId('item')).toHaveTextContent('First')
  })

  it('does not announce the position counter via aria-live (avoids SR spam)', () => {
    render(<Harness />)
    const counter = screen.getByText(/1 of 3/i)
    expect(counter).not.toHaveAttribute('aria-live')
  })

  it('exposes the current position in the region aria-label', () => {
    render(<Harness initial={1} />)
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute(
      'aria-label',
      expect.stringContaining('2 of 3'),
    )
  })

  it('does not advance when ArrowRight is pressed inside a textarea inside the cycler body', async () => {
    const user = userEvent.setup()
    function HarnessWithTextarea() {
      const [idx, setIdx] = useState(0)
      return (
        <AnnotationCycler
          title="t"
          items={fixtures}
          currentIndex={idx}
          onIndexChange={setIdx}
          renderItem={() => <textarea data-testid="composer" />}
          getKey={(item) => item.id}
        />
      )
    }
    render(<HarnessWithTextarea />)
    const composer = screen.getByTestId('composer') as HTMLTextAreaElement
    composer.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText(/1 of 3/i)).toBeInTheDocument()
  })

  it('does not advance when ArrowRight is pressed inside an input inside the cycler body', async () => {
    const user = userEvent.setup()
    function HarnessWithInput() {
      const [idx, setIdx] = useState(0)
      return (
        <AnnotationCycler
          title="t"
          items={fixtures}
          currentIndex={idx}
          onIndexChange={setIdx}
          renderItem={() => <input data-testid="composer-input" />}
          getKey={(item) => item.id}
        />
      )
    }
    render(<HarnessWithInput />)
    const composer = screen.getByTestId('composer-input') as HTMLInputElement
    composer.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText(/1 of 3/i)).toBeInTheDocument()
  })

  it('does not advance when ArrowRight is pressed inside a contentEditable element inside the cycler body', async () => {
    const user = userEvent.setup()
    function HarnessWithContentEditable() {
      const [idx, setIdx] = useState(0)
      return (
        <AnnotationCycler
          title="t"
          items={fixtures}
          currentIndex={idx}
          onIndexChange={setIdx}
          renderItem={() => (
            <div
              data-testid="editable"
              contentEditable
              suppressContentEditableWarning
            >
              type here
            </div>
          )}
          getKey={(item) => item.id}
        />
      )
    }
    render(<HarnessWithContentEditable />)
    const editable = screen.getByTestId('editable') as HTMLDivElement
    editable.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText(/1 of 3/i)).toBeInTheDocument()
  })

  it('renders medium-size (44px+) chevron buttons on mobile', () => {
    mockedUseIsMobile.mockReturnValue(true)
    try {
      render(<Harness />)
      const prev = screen.getByRole('button', { name: /previous/i })
      const next = screen.getByRole('button', { name: /next/i })
      // size="medium" → size-10 (40px) class; size="small" → size-8 (32px)
      expect(prev.className).toContain('size-10')
      expect(prev.className).not.toContain('size-8')
      expect(next.className).toContain('size-10')
      expect(next.className).not.toContain('size-8')
    } finally {
      mockedUseIsMobile.mockReturnValue(false)
    }
  })

  it('renders small-size chevron buttons on desktop', () => {
    mockedUseIsMobile.mockReturnValue(false)
    render(<Harness />)
    const prev = screen.getByRole('button', { name: /previous/i })
    const next = screen.getByRole('button', { name: /next/i })
    expect(prev.className).toContain('size-8')
    expect(prev.className).not.toContain('size-10')
    expect(next.className).toContain('size-8')
    expect(next.className).not.toContain('size-10')
  })

  it('does not advance when ArrowRight is pressed on a focusable descendant (e.g., a Retry button)', async () => {
    const user = userEvent.setup()
    function HarnessWithButton() {
      const [idx, setIdx] = useState(0)
      return (
        <AnnotationCycler
          title="t"
          items={fixtures}
          currentIndex={idx}
          onIndexChange={setIdx}
          renderItem={() => (
            <button data-testid="retry" type="button">
              Retry
            </button>
          )}
          getKey={(item) => item.id}
        />
      )
    }
    render(<HarnessWithButton />)
    const retry = screen.getByTestId('retry') as HTMLButtonElement
    retry.focus()
    expect(document.activeElement).toBe(retry)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText(/1 of 3/i)).toBeInTheDocument()
  })

  it('advances when ArrowRight is pressed while the region wrapper itself is focused', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const region = screen.getByRole('region', { name: /annotation cycler/i })
    region.focus()
    expect(document.activeElement).toBe(region)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByTestId('item')).toHaveTextContent('Second')
  })
})
