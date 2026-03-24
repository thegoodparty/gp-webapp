import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CampaignPlanTaskItem from './CampaignPlanTaskItem'

const defaultProps = {
  title: 'Test Task',
  description: 'A test description',
  date: 'Sep 7' as string | Date,
  type: 'Event',
}

describe('TaskItem date display', () => {
  it('renders a string date as-is', () => {
    render(<CampaignPlanTaskItem {...defaultProps} date="Sep 7" />)
    expect(screen.getByText('Sep 7')).toBeInTheDocument()
  })

  it('formats a Date object to "MMM d"', () => {
    render(
      <CampaignPlanTaskItem {...defaultProps} date={new Date(2025, 8, 7)} />,
    )
    expect(screen.getByText('Sep 7')).toBeInTheDocument()
  })

  it('does not shift the day for a UTC midnight ISO string parsed as Date', () => {
    // new Date('2025-09-07') is midnight UTC, which is Sep 6 in US timezones.
    // The component should still display "Sep 7".
    const utcDate = new Date('2025-09-07')
    render(<CampaignPlanTaskItem {...defaultProps} date={utcDate} />)
    expect(screen.getByText('Sep 7')).toBeInTheDocument()
  })

  it('handles year boundary dates correctly', () => {
    // new Date('2025-01-01') is midnight UTC → Dec 31 in negative TZ offsets
    const newYearUTC = new Date('2025-01-01')
    render(<CampaignPlanTaskItem {...defaultProps} date={newYearUTC} />)
    expect(screen.getByText('Jan 1')).toBeInTheDocument()
  })
})

describe('TaskItem interactions', () => {
  it('renders a lock instead of a checkbox when locked', () => {
    const { container } = render(
      <CampaignPlanTaskItem {...defaultProps} locked />,
    )

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(container.querySelectorAll('svg')).toHaveLength(1)
  })

  it('does not invoke onClick when locked', () => {
    const handleClick = vi.fn()

    render(
      <CampaignPlanTaskItem {...defaultProps} locked onClick={handleClick} />,
    )
    fireEvent.click(screen.getByText('Test Task'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('invokes onClick from the content area when unlocked', () => {
    const handleClick = vi.fn()

    render(<CampaignPlanTaskItem {...defaultProps} onClick={handleClick} />)
    fireEvent.click(screen.getByText('Test Task'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClick then opens http(s) links in a new tab', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const handleClick = vi.fn()

    render(
      <CampaignPlanTaskItem
        {...defaultProps}
        link="https://example.com/task"
        onClick={handleClick}
      />,
    )
    fireEvent.click(screen.getByText('Test Task'))

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(openSpy).toHaveBeenCalledWith(
      'https://example.com/task',
      '_blank',
      'noopener',
    )
    openSpy.mockRestore()
  })

  it('invokes onClick for internal app paths instead of window.open', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const handleClick = vi.fn()

    render(
      <CampaignPlanTaskItem
        {...defaultProps}
        link="/dashboard/campaign-details"
        onClick={handleClick}
      />,
    )
    fireEvent.click(screen.getByText('Test Task'))

    expect(openSpy).not.toHaveBeenCalled()
    expect(handleClick).toHaveBeenCalledTimes(1)
    openSpy.mockRestore()
  })

  it('forwards checkbox changes through onCheckedChange', () => {
    const handleCheckedChange = vi.fn()

    render(
      <CampaignPlanTaskItem
        {...defaultProps}
        onCheckedChange={handleCheckedChange}
      />,
    )
    fireEvent.click(screen.getByRole('checkbox'))

    expect(handleCheckedChange).toHaveBeenCalledWith(true)
  })
})
