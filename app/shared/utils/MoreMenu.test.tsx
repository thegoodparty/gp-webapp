import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { MoreMenu } from './MoreMenu'

vi.mock('@styleguide/components/ui/icons', () => ({
  EllipsisVerticalIcon: ({ className }: { className?: string }) => (
    <svg data-testid="ellipsis-icon" className={className} />
  ),
}))

vi.mock('@styleguide/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (v: boolean) => void
  }) => (
    <div data-testid="dropdown-root" data-open={open}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                onOpenChange?: (v: boolean) => void
              }>,
              { onOpenChange },
            )
          : child,
      )}
    </div>
  ),
  DropdownMenuTrigger: ({
    children,
    onOpenChange,
    asChild,
  }: {
    children: React.ReactNode
    onOpenChange?: (v: boolean) => void
    asChild?: boolean
  }) =>
    asChild && React.isValidElement(children)
      ? React.cloneElement(
          children as React.ReactElement<{ onClick?: () => void }>,
          { onClick: () => onOpenChange?.(true) },
        )
      : children,
  DropdownMenuContent: ({
    children,
    onOpenChange,
    align,
  }: {
    children: React.ReactNode
    onOpenChange?: (v: boolean) => void
    align?: string
  }) => (
    <div data-testid="dropdown-content" data-align={align}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                onOpenChange?: (v: boolean) => void
              }>,
              { onOpenChange },
            )
          : child,
      )}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <button data-testid="dropdown-item" onClick={onClick}>
      {children}
    </button>
  ),
}))

describe('MoreMenu', () => {
  it('renders the trigger icon', () => {
    render(<MoreMenu />)
    expect(screen.getByTestId('ellipsis-icon')).toBeInTheDocument()
  })

  it('opens the menu when trigger button is clicked', () => {
    render(<MoreMenu menuItems={[{ label: 'Edit', onClick: vi.fn() }]} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    expect(screen.getByTestId('dropdown-root')).toHaveAttribute(
      'data-open',
      'true',
    )
  })

  it('renders all menu item labels', () => {
    render(
      <MoreMenu
        menuItems={[
          { label: 'Edit', onClick: vi.fn() },
          { label: 'Delete', onClick: vi.fn() },
        ]}
      />,
    )
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls item onClick when a menu item is clicked', () => {
    const handleClick = vi.fn()
    render(
      <MoreMenu menuItems={[{ label: 'Publish', onClick: handleClick }]} />,
    )
    fireEvent.click(screen.getByTestId('dropdown-item'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when a menu item is clicked', () => {
    const handleClose = vi.fn()
    render(
      <MoreMenu
        onClose={handleClose}
        menuItems={[{ label: 'Remove', onClick: vi.fn() }]}
      />,
    )
    fireEvent.click(screen.getByTestId('dropdown-item'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('renders with no items without crashing', () => {
    render(<MoreMenu />)
    expect(screen.getByTestId('dropdown-root')).toBeInTheDocument()
  })
})
