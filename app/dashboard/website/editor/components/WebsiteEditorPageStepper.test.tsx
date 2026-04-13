import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import WebsiteEditorPageStepper from './WebsiteEditorPageStepper'

const defaultProps = {
  totalSteps: 6,
  currentStep: 1,
  onStepChange: vi.fn(),
  onComplete: vi.fn(),
}

describe('WebsiteEditorPageStepper', () => {
  it('renders the progress indicators for all steps', () => {
    const { container } = render(<WebsiteEditorPageStepper {...defaultProps} />)

    const progressDots = container.querySelectorAll('.rounded-full')
    expect(progressDots).toHaveLength(6)
  })

  it('highlights completed steps with bg-neutral-800', () => {
    const { container } = render(
      <WebsiteEditorPageStepper {...defaultProps} currentStep={3} />,
    )

    const progressDots = container.querySelectorAll('.rounded-full')
    expect(progressDots[0]).toHaveClass('bg-neutral-800')
    expect(progressDots[1]).toHaveClass('bg-neutral-800')
    expect(progressDots[2]).toHaveClass('bg-neutral-800')
    expect(progressDots[3]).toHaveClass('bg-gray-300')
  })

  it('renders Back and Next buttons', () => {
    render(<WebsiteEditorPageStepper {...defaultProps} />)

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('disables Back button on first step', () => {
    render(<WebsiteEditorPageStepper {...defaultProps} currentStep={1} />)

    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled()
  })

  it('enables Back button on steps after first', () => {
    render(<WebsiteEditorPageStepper {...defaultProps} currentStep={2} />)

    expect(screen.getByRole('button', { name: /back/i })).not.toBeDisabled()
  })

  it('calls onStepChange with next step when Next is clicked', () => {
    const onStepChange = vi.fn()
    render(
      <WebsiteEditorPageStepper
        {...defaultProps}
        currentStep={2}
        onStepChange={onStepChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onStepChange).toHaveBeenCalledWith(3)
  })

  it('calls onStepChange with previous step when Back is clicked', () => {
    const onStepChange = vi.fn()
    render(
      <WebsiteEditorPageStepper
        {...defaultProps}
        currentStep={3}
        onStepChange={onStepChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(onStepChange).toHaveBeenCalledWith(2)
  })

  it('renders Complete button on last step', () => {
    render(
      <WebsiteEditorPageStepper {...defaultProps} currentStep={6} canPublish />,
    )

    expect(
      screen.getByRole('button', { name: /complete/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /next/i }),
    ).not.toBeInTheDocument()
  })

  it('calls onComplete when Complete button is clicked', () => {
    const onComplete = vi.fn()
    render(
      <WebsiteEditorPageStepper
        {...defaultProps}
        currentStep={6}
        canPublish
        onComplete={onComplete}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /complete/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('disables Complete button when canPublish is false', () => {
    render(
      <WebsiteEditorPageStepper
        {...defaultProps}
        currentStep={6}
        canPublish={false}
      />,
    )

    expect(screen.getByRole('button', { name: /complete/i })).toBeDisabled()
  })

  it('shows cantSaveReason message on last step when provided', () => {
    render(
      <WebsiteEditorPageStepper
        {...defaultProps}
        currentStep={6}
        cantSaveReason="Invalid email"
      />,
    )

    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('does not show cantSaveReason message on non-final steps', () => {
    render(
      <WebsiteEditorPageStepper
        {...defaultProps}
        currentStep={3}
        cantSaveReason="Invalid email"
      />,
    )

    expect(screen.queryByText('Invalid email')).not.toBeInTheDocument()
  })

  it('uses custom button labels when provided', () => {
    render(
      <WebsiteEditorPageStepper
        {...defaultProps}
        prevLabel="Previous"
        nextLabel="Continue"
        completeLabel="Publish website"
        currentStep={6}
        canPublish
      />,
    )

    expect(
      screen.getByRole('button', { name: /previous/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /publish website/i }),
    ).toBeInTheDocument()
  })

  it('disables Next button when nextDisabled is true', () => {
    render(
      <WebsiteEditorPageStepper {...defaultProps} currentStep={3} nextDisabled />,
    )

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('calls onBeforeNext and stops if it returns false', () => {
    const onStepChange = vi.fn()
    const onBeforeNext = vi.fn().mockReturnValue(false)

    render(
      <WebsiteEditorPageStepper
        {...defaultProps}
        currentStep={3}
        onStepChange={onStepChange}
        onBeforeNext={onBeforeNext}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onBeforeNext).toHaveBeenCalledTimes(1)
    expect(onStepChange).not.toHaveBeenCalled()
  })

  it('calls onBeforeNext and proceeds if it returns true', () => {
    const onStepChange = vi.fn()
    const onBeforeNext = vi.fn().mockReturnValue(true)

    render(
      <WebsiteEditorPageStepper
        {...defaultProps}
        currentStep={3}
        onStepChange={onStepChange}
        onBeforeNext={onBeforeNext}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onBeforeNext).toHaveBeenCalledTimes(1)
    expect(onStepChange).toHaveBeenCalledWith(4)
  })

  it('has right padding on mobile/tablet to avoid chat widget overlap', () => {
    const { container } = render(<WebsiteEditorPageStepper {...defaultProps} />)

    // The outer container for the buttons/progress should have pr-16 for mobile
    // and lg:pr-0 for large screens
    const stepperContainer = container.querySelector('.flex.gap-4')
    expect(stepperContainer).toHaveClass('pr-16')
    expect(stepperContainer).toHaveClass('lg:pr-0')
  })
})
