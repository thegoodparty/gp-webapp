import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { useClearSelectionOnOpen } from './useClearSelectionOnOpen'

function Probe({ open }: { open: boolean }): null {
  useClearSelectionOnOpen(open)
  return null
}

function selectFirstTextNode(): { rangeCount: () => number } {
  const host = document.createElement('p')
  host.textContent = 'select me'
  document.body.appendChild(host)

  const range = document.createRange()
  const textNode = host.firstChild as Text
  range.setStart(textNode, 0)
  range.setEnd(textNode, textNode.length)

  const selection = window.getSelection()
  if (!selection) throw new Error('window.getSelection() returned null')
  selection.removeAllRanges()
  selection.addRange(range)

  return {
    rangeCount: () => window.getSelection()?.rangeCount ?? 0,
  }
}

describe('useClearSelectionOnOpen', () => {
  it('leaves an active selection alone when open is false', () => {
    const sel = selectFirstTextNode()
    expect(sel.rangeCount()).toBe(1)

    render(<Probe open={false} />)

    expect(sel.rangeCount()).toBe(1)
  })

  it('clears the active selection when open transitions to true', () => {
    const sel = selectFirstTextNode()
    expect(sel.rangeCount()).toBe(1)

    const { rerender } = render(<Probe open={false} />)
    expect(sel.rangeCount()).toBe(1)

    rerender(<Probe open={true} />)

    expect(sel.rangeCount()).toBe(0)
  })

  it('clears the selection on mount when open is initially true', () => {
    const sel = selectFirstTextNode()
    expect(sel.rangeCount()).toBe(1)

    render(<Probe open={true} />)

    expect(sel.rangeCount()).toBe(0)
  })
})
