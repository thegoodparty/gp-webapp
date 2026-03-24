import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { ModalOrDrawer } from './ModalOrDrawer'

vi.mock('@styleguide/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div className={className} data-slot="dialog-content">
      {children}
    </div>
  ),
  DialogTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <h2 className={className}>{children}</h2>,
}))

vi.mock('@styleguide/components/ui/drawer', () => ({
  Drawer: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div role="dialog">{children}</div> : null,
  DrawerContent: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div className={className} data-slot="drawer-content">
      {children}
    </div>
  ),
  DrawerTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <h2 className={className}>{children}</h2>,
  DrawerClose: ({
    children,
    onClick,
    ...rest
  }: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
  }) => (
    <button {...rest} onClick={onClick}>
      {children}
    </button>
  ),
}))

vi.mock('@styleguide/components/ui/icons', () => ({
  XMarkIcon: () => <span>×</span>,
}))

vi.mock('@shared/hooks/useTailwindBreakpoints', () => ({
  useTailwindBreakpoints: vi.fn(() => 'lg'),
}))

import { useTailwindBreakpoints } from '@shared/hooks/useTailwindBreakpoints'
const mockBreakpoint = vi.mocked(useTailwindBreakpoints)

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  title: 'Test Title',
}

beforeEach(() => {
  mockBreakpoint.mockReturnValue('lg')
  defaultProps.onOpenChange.mockClear()
})

describe('ModalOrDrawer', () => {
  it.each(['md', 'lg', 'xl'] as const)(
    'renders title and children on %s (desktop) breakpoint',
    (bp) => {
      mockBreakpoint.mockReturnValue(bp)
      render(
        <ModalOrDrawer {...defaultProps}>
          <p>Modal content</p>
        </ModalOrDrawer>,
      )
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Modal content')).toBeInTheDocument()
    },
  )

  it.each(['xs', 'sm'] as const)(
    'renders title, children, and close button on %s (mobile) breakpoint',
    (bp) => {
      mockBreakpoint.mockReturnValue(bp)
      render(
        <ModalOrDrawer {...defaultProps}>
          <p>Drawer content</p>
        </ModalOrDrawer>,
      )
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Drawer content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    },
  )

  it('does not render content when open is false', () => {
    render(
      <ModalOrDrawer {...defaultProps} open={false}>
        <p>Hidden content</p>
      </ModalOrDrawer>,
    )
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('applies dialogClassName on desktop breakpoints', () => {
    render(
      <ModalOrDrawer {...defaultProps} dialogClassName="custom-dialog">
        <p>Content</p>
      </ModalOrDrawer>,
    )
    expect(screen.getByText('Content').parentElement).toHaveClass(
      'custom-dialog',
    )
  })

  it('applies drawerClassName on mobile breakpoints', () => {
    mockBreakpoint.mockReturnValue('xs')
    render(
      <ModalOrDrawer {...defaultProps} drawerClassName="custom-drawer">
        <p>Content</p>
      </ModalOrDrawer>,
    )
    expect(
      screen.getByText('Content').closest('[data-slot="drawer-content"]'),
    ).toHaveClass('custom-drawer')
  })

  it('hides title visually with sr-only for accessibility', () => {
    render(
      <ModalOrDrawer {...defaultProps} title="Accessible Title">
        <p>Content</p>
      </ModalOrDrawer>,
    )
    const titleEl = screen.getByText('Accessible Title')
    expect(titleEl).toHaveClass('sr-only')
  })

  it('renders close button with sr-only label on mobile', () => {
    mockBreakpoint.mockReturnValue('sm')
    render(
      <ModalOrDrawer {...defaultProps}>
        <p>Content</p>
      </ModalOrDrawer>,
    )
    const closeButton = screen.getByRole('button', { name: /close/i })
    expect(closeButton).toBeInTheDocument()
  })
})
