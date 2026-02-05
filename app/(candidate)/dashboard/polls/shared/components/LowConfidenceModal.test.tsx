import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LowConfidenceModal from './LowConfidenceModal'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock ResponsiveModal to simplify testing
vi.mock('@shared/utils/ResponsiveModal', () => ({
  default: ({
    open,
    children,
    preventBackdropClose,
    preventEscClose,
    hideClose,
  }: {
    open: boolean
    children: React.ReactNode
    preventBackdropClose?: boolean
    preventEscClose?: boolean
    hideClose?: boolean
  }) =>
    open ? (
      <div
        data-testid="responsive-modal"
        data-prevent-backdrop-close={preventBackdropClose}
        data-prevent-esc-close={preventEscClose}
        data-hide-close={hideClose}
      >
        {children}
      </div>
    ) : null,
}))

describe('LowConfidenceModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onButtonClick: vi.fn(),
    pollId: 'test-poll-123',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the modal when open is true', () => {
    render(<LowConfidenceModal {...defaultProps} />)

    expect(screen.getByTestId('responsive-modal')).toBeInTheDocument()
    expect(
      screen.getByText(/didn't respond to your poll for reliable feedback/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /We recommend you run the same poll to a larger sample of residents/i,
      ),
    ).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(<LowConfidenceModal {...defaultProps} open={false} />)

    expect(screen.queryByTestId('responsive-modal')).not.toBeInTheDocument()
  })

  it('renders both action buttons', () => {
    render(<LowConfidenceModal {...defaultProps} />)

    expect(
      screen.getByRole('button', { name: /view partial results/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /gather more feedback/i }),
    ).toBeInTheDocument()
  })

  it('configures modal to prevent closing on backdrop click', () => {
    render(<LowConfidenceModal {...defaultProps} />)

    const modal = screen.getByTestId('responsive-modal')
    expect(modal).toHaveAttribute('data-prevent-backdrop-close', 'true')
  })

  it('configures modal to prevent closing on escape key', () => {
    render(<LowConfidenceModal {...defaultProps} />)

    const modal = screen.getByTestId('responsive-modal')
    expect(modal).toHaveAttribute('data-prevent-esc-close', 'true')
  })

  it('configures modal to hide the close button', () => {
    render(<LowConfidenceModal {...defaultProps} />)

    const modal = screen.getByTestId('responsive-modal')
    expect(modal).toHaveAttribute('data-hide-close', 'true')
  })

  describe('View partial results button', () => {
    it('calls onButtonClick with "viewPartialResults" when clicked', () => {
      render(<LowConfidenceModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /view partial results/i })
      fireEvent.click(button)

      expect(defaultProps.onButtonClick).toHaveBeenCalledWith(
        'viewPartialResults',
      )
    })

    it('calls onClose when clicked', () => {
      render(<LowConfidenceModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /view partial results/i })
      fireEvent.click(button)

      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('does not navigate when clicked', () => {
      render(<LowConfidenceModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /view partial results/i })
      fireEvent.click(button)

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Gather more feedback button', () => {
    it('calls onButtonClick with "gatherMoreFeedback" when clicked', () => {
      render(<LowConfidenceModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /gather more feedback/i })
      fireEvent.click(button)

      expect(defaultProps.onButtonClick).toHaveBeenCalledWith(
        'gatherMoreFeedback',
      )
    })

    it('navigates to the expand poll page when clicked', () => {
      render(<LowConfidenceModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /gather more feedback/i })
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith(
        `/dashboard/polls/${defaultProps.pollId}/expand`,
      )
    })

    it('does not call onClose when clicked (navigation handles closing)', () => {
      render(<LowConfidenceModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /gather more feedback/i })
      fireEvent.click(button)

      expect(defaultProps.onClose).not.toHaveBeenCalled()
    })
  })

  it('works without onButtonClick callback', () => {
    const propsWithoutCallback = {
      open: true,
      onClose: vi.fn(),
      pollId: 'test-poll-123',
    }

    render(<LowConfidenceModal {...propsWithoutCallback} />)

    const viewButton = screen.getByRole('button', { name: /view partial results/i })
    const gatherButton = screen.getByRole('button', { name: /gather more feedback/i })

    // Should not throw when clicking buttons without callback
    expect(() => fireEvent.click(viewButton)).not.toThrow()
    expect(() => fireEvent.click(gatherButton)).not.toThrow()
  })

  it('displays the info icon', () => {
    render(<LowConfidenceModal {...defaultProps} />)

    // The icon should be within a blue circle container
    const iconContainer = document.querySelector('.bg-blue-100')
    expect(iconContainer).toBeInTheDocument()
    expect(iconContainer).toHaveClass('rounded-full')
  })
})
