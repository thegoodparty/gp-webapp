import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { ModalOrDrawer } from './ModalOrDrawer'

interface MockEvent {
  defaultPrevented: boolean
  preventDefault: () => void
}

vi.mock('@styleguide/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode
    open: boolean
    onOpenChange?: (open: boolean) => void
  }) =>
    open ? (
      <div role="dialog">
        <button
          aria-label="trigger-open-change"
          onClick={() => onOpenChange?.(false)}
        />
        {children}
      </div>
    ) : null,
  DialogContent: ({
    children,
    className,
    onInteractOutside,
    onEscapeKeyDown,
  }: {
    children: React.ReactNode
    className?: string
    onInteractOutside?: (e: MockEvent) => void
    onEscapeKeyDown?: (e: MockEvent) => void
  }) => (
    <div className={className} data-slot="dialog-content">
      <button
        aria-label="interact-outside"
        onClick={() => {
          const e: MockEvent = {
            defaultPrevented: false,
            preventDefault() {
              this.defaultPrevented = true
            },
          }
          onInteractOutside?.(e)
          if (!e.defaultPrevented) {
            document.body.setAttribute('data-dialog-dismissed', 'true')
          }
        }}
      />
      <button
        aria-label="escape-key"
        onClick={() => {
          const e: MockEvent = {
            defaultPrevented: false,
            preventDefault() {
              this.defaultPrevented = true
            },
          }
          onEscapeKeyDown?.(e)
          if (!e.defaultPrevented) {
            document.body.setAttribute('data-dialog-dismissed', 'true')
          }
        }}
      />
      <button aria-label="Close" data-slot="dialog-close" />
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
  Drawer: ({
    children,
    open,
    dismissible,
  }: {
    children: React.ReactNode
    open: boolean
    dismissible?: boolean
  }) =>
    open ? (
      <div role="dialog" data-dismissible={String(dismissible)}>
        {children}
      </div>
    ) : null,
  DrawerContent: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div className={className} data-slot="drawer-content">
      <button aria-label="Close" data-slot="drawer-auto-close" />
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
  document.body.removeAttribute('data-dialog-dismissed')
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
      const closeButtons = screen.getAllByRole('button', { name: /close/i })
      expect(closeButtons).toHaveLength(1)
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
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    expect(closeButtons).toHaveLength(1)
  })

  describe('preventOutsideClose (desktop / Dialog)', () => {
    it('dismisses on outside interaction by default', () => {
      render(
        <ModalOrDrawer {...defaultProps}>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'interact-outside' }))
      expect(document.body).toHaveAttribute('data-dialog-dismissed', 'true')
    })

    it('does not dismiss on outside interaction when preventOutsideClose is set', () => {
      render(
        <ModalOrDrawer {...defaultProps} preventOutsideClose>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'interact-outside' }))
      expect(document.body).not.toHaveAttribute('data-dialog-dismissed')
    })
  })

  describe('preventEscClose (desktop / Dialog)', () => {
    it('dismisses on escape by default', () => {
      render(
        <ModalOrDrawer {...defaultProps}>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'escape-key' }))
      expect(document.body).toHaveAttribute('data-dialog-dismissed', 'true')
    })

    it('does not dismiss on escape when preventEscClose is set', () => {
      render(
        <ModalOrDrawer {...defaultProps} preventEscClose>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'escape-key' }))
      expect(document.body).not.toHaveAttribute('data-dialog-dismissed')
    })
  })

  describe('hideClose', () => {
    it('hides the built-in close button on desktop via last-child selector', () => {
      render(
        <ModalOrDrawer {...defaultProps} hideClose>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      expect(
        screen.getByText('Content').closest('[data-slot="dialog-content"]'),
      ).toHaveClass('[&>button:last-child]:hidden')
    })

    it('hides the built-in close button on mobile via first-child selector', () => {
      mockBreakpoint.mockReturnValue('xs')
      render(
        <ModalOrDrawer {...defaultProps} hideClose>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      expect(
        screen.getByText('Content').closest('[data-slot="drawer-content"]'),
      ).toHaveClass('[&>button:first-child]:hidden')
    })

    it('does not hide the close button when hideClose is unset', () => {
      render(
        <ModalOrDrawer {...defaultProps}>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      expect(
        screen.getByText('Content').closest('[data-slot="dialog-content"]'),
      ).not.toHaveClass('[&>button:last-child]:hidden')
    })
  })

  describe('preventOutsideClose (mobile / Drawer)', () => {
    it('passes dismissible=true to the drawer by default', () => {
      mockBreakpoint.mockReturnValue('xs')
      render(
        <ModalOrDrawer {...defaultProps}>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'data-dismissible',
        'true',
      )
    })

    it('passes dismissible=false to the drawer when preventOutsideClose is set', () => {
      mockBreakpoint.mockReturnValue('xs')
      render(
        <ModalOrDrawer {...defaultProps} preventOutsideClose>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'data-dismissible',
        'false',
      )
    })
  })

  describe('fullSize', () => {
    it('applies full-size sizing classes on desktop', () => {
      render(
        <ModalOrDrawer {...defaultProps} fullSize>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      expect(
        screen.getByText('Content').closest('[data-slot="dialog-content"]'),
      ).toHaveClass('h-[90vh]')
    })

    it('applies full-size sizing classes on mobile', () => {
      mockBreakpoint.mockReturnValue('xs')
      render(
        <ModalOrDrawer {...defaultProps} fullSize>
          <p>Content</p>
        </ModalOrDrawer>,
      )
      expect(
        screen.getByText('Content').closest('[data-slot="drawer-content"]'),
      ).toHaveClass('h-[90vh]')
    })
  })
})
