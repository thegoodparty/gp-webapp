import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import ResponsiveModal from './ResponsiveModal'

const modalOrDrawerSpy = vi.fn()

vi.mock('@shared/ui/ModalOrDrawer', () => ({
  ModalOrDrawer: (props: {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
    title: string
    preventOutsideClose?: boolean
    preventEscClose?: boolean
    hideClose?: boolean
    fullSize?: boolean
  }) => {
    modalOrDrawerSpy(props)
    const { open, onOpenChange, children, title } = props
    return open ? (
      <div role="dialog">
        {title && <h2>{title}</h2>}
        <button onClick={() => onOpenChange(false)}>Close</button>
        {children}
      </div>
    ) : null
  },
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

  it('forwards preventBackdropClose to ModalOrDrawer as preventOutsideClose', () => {
    render(
      <ResponsiveModal open preventBackdropClose onClose={() => {}}>
        <p>Content</p>
      </ResponsiveModal>,
    )
    expect(modalOrDrawerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ preventOutsideClose: true }),
    )
  })

  it('forwards preventEscClose to ModalOrDrawer', () => {
    render(
      <ResponsiveModal open preventEscClose onClose={() => {}}>
        <p>Content</p>
      </ResponsiveModal>,
    )
    expect(modalOrDrawerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ preventEscClose: true }),
    )
  })

  it('forwards hideClose to ModalOrDrawer', () => {
    render(
      <ResponsiveModal open hideClose onClose={() => {}}>
        <p>Content</p>
      </ResponsiveModal>,
    )
    expect(modalOrDrawerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ hideClose: true }),
    )
  })

  it('forwards fullSize to ModalOrDrawer', () => {
    render(
      <ResponsiveModal open fullSize onClose={() => {}}>
        <p>Content</p>
      </ResponsiveModal>,
    )
    expect(modalOrDrawerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ fullSize: true }),
    )
  })

  it('defaults the dismissal/sizing props to false when unset', () => {
    render(
      <ResponsiveModal open onClose={() => {}}>
        <p>Content</p>
      </ResponsiveModal>,
    )
    expect(modalOrDrawerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        preventOutsideClose: false,
        preventEscClose: false,
        hideClose: false,
        fullSize: false,
      }),
    )
  })
})
