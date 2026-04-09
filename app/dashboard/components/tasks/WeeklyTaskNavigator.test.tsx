import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { addWeeks, startOfWeek, format, endOfWeek } from 'date-fns'
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

    expect(screen.getByText('Jun 1-6')).toBeInTheDocument()
  })

  it('renders the date range spanning two months', () => {
    render(
      <WeeklyTaskNavigator
        {...defaultProps}
        currentWeekStart={new Date('2026/04/28')}
      />,
    )

    expect(screen.getByText('Apr 28 - May 2')).toBeInTheDocument()
  })

  it('shows only "This week" with no date range when today falls in the range', () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 })

    render(
      <WeeklyTaskNavigator {...defaultProps} currentWeekStart={weekStart} />,
    )

    expect(screen.getByText('This week')).toBeInTheDocument()
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 })
    const dateRange = `${format(weekStart, 'MMM')} ${format(
      weekStart,
      'd',
    )}-${format(weekEnd, 'd')}`
    expect(screen.queryByText(dateRange)).not.toBeInTheDocument()
  })

  it('shows date range instead of "Next week" label for the following week', () => {
    const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), {
      weekStartsOn: 0,
    })

    render(
      <WeeklyTaskNavigator
        {...defaultProps}
        currentWeekStart={nextWeekStart}
      />,
    )

    expect(screen.queryByText('Next week')).not.toBeInTheDocument()
    const weekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 0 })
    const startMonth = format(nextWeekStart, 'MMM')
    const endMonth = format(weekEnd, 'MMM')
    const expectedRange =
      startMonth === endMonth
        ? `${startMonth} ${format(nextWeekStart, 'd')}-${format(weekEnd, 'd')}`
        : `${format(nextWeekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
    expect(screen.getByText(expectedRange)).toBeInTheDocument()
  })

  it('shows date range instead of "Last week" label for the previous week', () => {
    const lastWeekStart = startOfWeek(addWeeks(new Date(), -1), {
      weekStartsOn: 0,
    })

    render(
      <WeeklyTaskNavigator
        {...defaultProps}
        currentWeekStart={lastWeekStart}
      />,
    )

    expect(screen.queryByText('Last week')).not.toBeInTheDocument()
    const weekEnd = endOfWeek(lastWeekStart, { weekStartsOn: 0 })
    const startMonth = format(lastWeekStart, 'MMM')
    const endMonth = format(weekEnd, 'MMM')
    const expectedRange =
      startMonth === endMonth
        ? `${startMonth} ${format(lastWeekStart, 'd')}-${format(weekEnd, 'd')}`
        : `${format(lastWeekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
    expect(screen.getByText(expectedRange)).toBeInTheDocument()
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
