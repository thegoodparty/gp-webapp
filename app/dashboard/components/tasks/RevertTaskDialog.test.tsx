import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import RevertTaskDialog from './RevertTaskDialog'

const AlertDialogContext = React.createContext<{
  onOpenChange: (open: boolean) => void
} | null>(null)

vi.mock('@styleguide', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    AlertDialog: ({
      open,
      onOpenChange,
      children,
    }: {
      open: boolean
      onOpenChange: (open: boolean) => void
      children: React.ReactNode
    }) =>
      open ? (
        <AlertDialogContext.Provider value={{ onOpenChange }}>
          <div role="alertdialog" data-testid="alert-dialog">
            {children}
          </div>
        </AlertDialogContext.Provider>
      ) : null,
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
      <h2>{children}</h2>
    ),
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
      <p>{children}</p>
    ),
    AlertDialogAction: ({
      children,
      onClick,
    }: {
      children: React.ReactNode
      onClick?: () => void
    }) => <button onClick={onClick}>{children}</button>,
    AlertDialogCancel: ({
      children,
      disabled,
    }: {
      children: React.ReactNode
      disabled?: boolean
    }) => {
      const ctx = React.useContext(AlertDialogContext)
      return (
        <button
          type="button"
          disabled={disabled}
          onClick={() => ctx?.onOpenChange(false)}
        >
          {children}
        </button>
      )
    },
  }
})

describe('RevertTaskDialog', () => {
  it('renders nothing when closed', () => {
    render(
      <RevertTaskDialog
        open={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('renders title and description when open', () => {
    render(
      <RevertTaskDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(screen.getByText('Mark task as incomplete?')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Are you sure you want to mark this task as incomplete?',
      ),
    ).toBeInTheDocument()
  })

  it('calls onConfirm when Confirm is clicked', async () => {
    const user = userEvent.setup()
    const handleConfirm = vi.fn()

    render(
      <RevertTaskDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={handleConfirm}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onOpenChange(false) when Cancel is used', async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()

    render(
      <RevertTaskDialog
        open={true}
        onOpenChange={handleOpenChange}
        onConfirm={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })
})
