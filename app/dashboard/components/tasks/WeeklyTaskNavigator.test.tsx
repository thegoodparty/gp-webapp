import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { addDays, addWeeks } from 'date-fns'
import WeeklyTaskNavigator from './WeeklyTaskNavigator'

describe('WeeklyTaskNavigator', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026/06/10 12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const defaultProps = {
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    canGoPrevious: true,
    canGoNext: true,
  }

  it('renders the date range for a week within the same month', () => {
    render(
      <WeeklyTaskNavigator
        {...defaultProps}
        currentWeekStart={new Date('2026/06/01')}
      />,
    )

    expect(screen.getByText('Jun 1-7')).toBeInTheDocument()
  })

  it('renders the date range spanning two months', () => {
    render(
      <WeeklyTaskNavigator
        {...defaultProps}
        currentWeekStart={new Date('2026/04/28')}
      />,
    )

    expect(screen.getByText('Apr 28 - May 4')).toBeInTheDocument()
  })

  it('shows "This week" when today falls in the range', () => {
    const today = new Date()
    const weekStart = addDays(today, -2)

    render(
      <WeeklyTaskNavigator {...defaultProps} currentWeekStart={weekStart} />,
    )

    expect(screen.getByText('This week')).toBeInTheDocument()
  })

  it('shows "Next week" for the following week range', () => {
    const today = new Date()
    const nextWeekStart = addWeeks(today, 1)

    render(
      <WeeklyTaskNavigator
        {...defaultProps}
        currentWeekStart={nextWeekStart}
      />,
    )

    expect(screen.getByText('Next week')).toBeInTheDocument()
  })

  it('shows "Last week" for the previous week range', () => {
    const today = new Date()
    const lastWeekStart = addWeeks(today, -1)

    render(
      <WeeklyTaskNavigator
        {...defaultProps}
        currentWeekStart={lastWeekStart}
      />,
    )

    expect(screen.getByText('Last week')).toBeInTheDocument()
  })

  it('disables previous button when canGoPrevious is false', () => {
    render(
      <WeeklyTaskNavigator
        {...defaultProps}
        currentWeekStart={new Date('2026/06/01')}
        canGoPrevious={false}
      />,
    )

    expect(screen.getByLabelText('Previous week')).toBeDisabled()
  })

  it('disables next button when canGoNext is false', () => {
    render(
      <WeeklyTaskNavigator
        {...defaultProps}
        currentWeekStart={new Date('2026/06/01')}
        canGoNext={false}
      />,
    )

    expect(screen.getByLabelText('Next week')).toBeDisabled()
  })

  it('calls onPrevious and onNext when buttons are clicked', async () => {
    vi.useRealTimers()

    try {
      const user = userEvent.setup()
      const onPrevious = vi.fn()
      const onNext = vi.fn()

      render(
        <WeeklyTaskNavigator
          currentWeekStart={new Date('2026/06/01')}
          onPrevious={onPrevious}
          onNext={onNext}
          canGoPrevious={true}
          canGoNext={true}
        />,
      )

      await user.click(screen.getByLabelText('Previous week'))
      expect(onPrevious).toHaveBeenCalledOnce()

      await user.click(screen.getByLabelText('Next week'))
      expect(onNext).toHaveBeenCalledOnce()
    } finally {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026/06/10 12:00:00'))
    }
  })
})
