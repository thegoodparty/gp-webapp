import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import ResponsiveModal from './ResponsiveModal'

vi.mock('@shared/ui/ModalOrDrawer', () => ({
  ModalOrDrawer: ({
    open,
    onOpenChange,
    children,
    title,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
    title: string
  }) =>
    open ? (
      <div role="dialog">
        {title && <h2>{title}</h2>}
        <button onClick={() => onOpenChange(false)}>Close</button>
        {children}
      </div>
    ) : null,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ResponsiveModal', () => {
  it('renders children when open', () => {
    render(
      <ResponsiveModal open onClose={() => {}}>
        <p>Modal content</p>
      </ResponsiveModal>,
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render children when closed', () => {
    render(
      <ResponsiveModal open={false} onClose={() => {}}>
        <p>Hidden content</p>
      </ResponsiveModal>,
    )
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(
      <ResponsiveModal open onClose={() => {}} title="My Title">
        <p>Content</p>
      </ResponsiveModal>,
    )
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('calls onClose when the dialog requests close', () => {
    const onClose = vi.fn()
    render(
      <ResponsiveModal open onClose={onClose}>
        <p>Content</p>
      </ResponsiveModal>,
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when open is false (no dialog rendered)', () => {
    const onClose = vi.fn()
    render(
      <ResponsiveModal open={false} onClose={onClose}>
        <p>Content</p>
      </ResponsiveModal>,
    )
    expect(onClose).not.toHaveBeenCalled()
  })

  it('accepts preventBackdropClose prop without error', () => {
    expect(() =>
      render(
        <ResponsiveModal open preventBackdropClose onClose={() => {}}>
          <p>Content</p>
        </ResponsiveModal>,
      ),
    ).not.toThrow()
  })

  it('accepts preventEscClose prop without error', () => {
    expect(() =>
      render(
        <ResponsiveModal open preventEscClose onClose={() => {}}>
          <p>Content</p>
        </ResponsiveModal>,
      ),
    ).not.toThrow()
  })

  it('accepts hideClose prop without error', () => {
    expect(() =>
      render(
        <ResponsiveModal open hideClose onClose={() => {}}>
          <p>Content</p>
        </ResponsiveModal>,
      ),
    ).not.toThrow()
  })

  it('accepts fullSize prop without error', () => {
    expect(() =>
      render(
        <ResponsiveModal open fullSize onClose={() => {}}>
          <p>Content</p>
        </ResponsiveModal>,
      ),
    ).not.toThrow()
  })
})
