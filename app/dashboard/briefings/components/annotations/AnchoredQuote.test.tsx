import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnchoredQuote } from './AnchoredQuote'

describe('<AnchoredQuote>', () => {
  it('renders the text inside a <blockquote>', () => {
    const { container } = render(<AnchoredQuote text="Hello world" />)
    const blockquote = container.querySelector('blockquote')
    expect(blockquote).not.toBeNull()
    expect(blockquote?.textContent).toContain('Hello world')
  })

  it('renders the "Anchored to" label by default', () => {
    render(<AnchoredQuote text="Some passage" />)
    expect(screen.getByText(/anchored to/i)).toBeInTheDocument()
  })

  it('hides the "Anchored to" label when showLabel is false', () => {
    render(<AnchoredQuote text="Some passage" showLabel={false} />)
    expect(screen.queryByText(/anchored to/i)).not.toBeInTheDocument()
  })

  it('uses border-border on the default variant', () => {
    const { container } = render(<AnchoredQuote text="x" />)
    const blockquote = container.querySelector('blockquote')
    expect(blockquote?.className).toContain('border-border')
  })

  it('uses border-destructive on the destructive variant', () => {
    const { container } = render(
      <AnchoredQuote text="x" variant="destructive" />,
    )
    const blockquote = container.querySelector('blockquote')
    expect(blockquote?.className).toContain('border-destructive')
  })

  it('uses a 2px (border-l-2) left bar on the destructive variant to match the design spec', () => {
    const { container } = render(
      <AnchoredQuote text="x" variant="destructive" />,
    )
    const blockquote = container.querySelector('blockquote')
    expect(blockquote?.className).toContain('border-l-2')
  })

  it('uses border-primary on the primary variant', () => {
    const { container } = render(<AnchoredQuote text="x" variant="primary" />)
    const blockquote = container.querySelector('blockquote')
    expect(blockquote?.className).toContain('border-primary')
  })

  it('applies line-through to the blockquote when strike is true', () => {
    const { container } = render(<AnchoredQuote text="x" strike />)
    const blockquote = container.querySelector('blockquote')
    expect(blockquote?.className).toContain('line-through')
  })

  it('does not apply line-through by default', () => {
    const { container } = render(<AnchoredQuote text="x" />)
    const blockquote = container.querySelector('blockquote')
    expect(blockquote?.className).not.toContain('line-through')
  })
})
