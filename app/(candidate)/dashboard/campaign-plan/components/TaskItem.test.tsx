import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TaskItem from './TaskItem'

const defaultProps = {
  title: 'Test Task',
  description: 'A test description',
  date: 'Sep 7' as string | Date,
  type: 'Event',
}

describe('TaskItem date display', () => {
  it('renders a string date as-is', () => {
    render(<TaskItem {...defaultProps} date="Sep 7" />)
    expect(screen.getByText('Sep 7')).toBeInTheDocument()
  })

  it('formats a Date object to "MMM d"', () => {
    render(<TaskItem {...defaultProps} date={new Date(2025, 8, 7)} />)
    expect(screen.getByText('Sep 7')).toBeInTheDocument()
  })

  it('does not shift the day for a UTC midnight ISO string parsed as Date', () => {
    // new Date('2025-09-07') is midnight UTC, which is Sep 6 in US timezones.
    // The component should still display "Sep 7".
    const utcDate = new Date('2025-09-07')
    render(<TaskItem {...defaultProps} date={utcDate} />)
    expect(screen.getByText('Sep 7')).toBeInTheDocument()
  })

  it('handles year boundary dates correctly', () => {
    // new Date('2025-01-01') is midnight UTC → Dec 31 in negative TZ offsets
    const newYearUTC = new Date('2025-01-01')
    render(<TaskItem {...defaultProps} date={newYearUTC} />)
    expect(screen.getByText('Jan 1')).toBeInTheDocument()
  })
})
