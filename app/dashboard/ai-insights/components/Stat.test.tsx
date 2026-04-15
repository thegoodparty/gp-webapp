import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stat } from './Stat'

describe('Stat', () => {
  it('renders the label text', () => {
    render(<Stat label="Total Voters" value={1200} />)
    expect(screen.getByText('Total Voters')).toBeInTheDocument()
  })

  it('renders a string value', () => {
    render(<Stat label="Status" value="Active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders a numeric value', () => {
    render(<Stat label="Win Number" value={5432} />)
    expect(screen.getByText('5432')).toBeInTheDocument()
  })
})
