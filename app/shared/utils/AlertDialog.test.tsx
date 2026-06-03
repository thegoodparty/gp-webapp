import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import AlertDialog from './AlertDialog'

vi.mock('@styleguide/components/ui/alert-dialog', () => ({
  AlertDialog: ({
    open,
    children,
  }: {
    open?: boolean
    children: React.ReactNode
  }) => (open ? <div role="alertdialog">{children}</div> : null),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-slot="alert-dialog-content">{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-slot="alert-dialog-header">{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-slot="alert-dialog-footer">{children}</div>
  ),
  AlertDialogAction: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
  }) => (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  ),
  AlertDialogCancel: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

const defaultProps = {
  open: true,
  handleClose: vi.fn(),
  handleProceed: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AlertDialog', () => {
  it('renders when open is true', () => {
    render(<AlertDialog {...defaultProps} />)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(<AlertDialog {...defaultProps} open={false} />)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<AlertDialog {...defaultProps} title="Confirm Action" />)
    expect(screen.getByText('Confirm Action')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<AlertDialog {...defaultProps} description="Are you sure?" />)
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('renders a ReactNode description', () => {
    render(
      <AlertDialog
        {...defaultProps}
        description={<span data-testid="custom-desc">Custom node</span>}
      />,
    )
    expect(screen.getByTestId('custom-desc')).toBeInTheDocument()
  })

  it('renders default cancelLabel', () => {
    render(<AlertDialog {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('renders default proceedLabel', () => {
    render(<AlertDialog {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Proceed' })).toBeInTheDocument()
  })

  it('renders custom cancelLabel', () => {
    render(<AlertDialog {...defaultProps} cancelLabel="Go back" />)
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument()
  })

  it('renders custom proceedLabel', () => {
    render(<AlertDialog {...defaultProps} proceedLabel="Delete it" />)
    expect(
      screen.getByRole('button', { name: 'Delete it' }),
    ).toBeInTheDocument()
  })

  it('calls handleProceed when proceed button is clicked', () => {
    render(<AlertDialog {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Proceed' }))
    expect(defaultProps.handleProceed).toHaveBeenCalledTimes(1)
  })

  it('calls handleClose when cancel button is clicked and no onCancel provided', () => {
    render(<AlertDialog {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(defaultProps.handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel instead of handleClose when onCancel is provided', () => {
    const onCancel = vi.fn()
    render(<AlertDialog {...defaultProps} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(defaultProps.handleClose).not.toHaveBeenCalled()
  })

  it('applies button-destructive class when redButton is true (default)', () => {
    render(<AlertDialog {...defaultProps} />)
    const proceedBtn = screen.getByRole('button', { name: 'Proceed' })
    expect(proceedBtn.className).toMatch(/button-destructive/)
  })

  it('applies button-primary class when redButton is false', () => {
    render(<AlertDialog {...defaultProps} redButton={false} />)
    const proceedBtn = screen.getByRole('button', { name: 'Proceed' })
    expect(proceedBtn.className).toMatch(/button-primary/)
    expect(proceedBtn.className).not.toMatch(/button-destructive/)
  })
})
