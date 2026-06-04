import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InfoAlert } from '@shared/alerts/InfoAlert'

describe('InfoAlert', () => {
  it('renders children', () => {
    render(<InfoAlert>For your information</InfoAlert>)
    expect(screen.getByText('For your information')).toBeInTheDocument()
  })

  it('applies info severity token classes', () => {
    const { container } = render(<InfoAlert>Info text</InfoAlert>)
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/text-info-dark/)
    expect(alert?.className).toMatch(/bg-info-background/)
    expect(alert?.className).toMatch(/border-info-dark/)
  })

  it('forwards className', () => {
    const { container } = render(<InfoAlert className="mb-4">Info</InfoAlert>)
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/mb-4/)
  })

  it('ignores variant prop without throwing', () => {
    expect(() =>
      render(<InfoAlert variant="outlined">No throw</InfoAlert>),
    ).not.toThrow()
  })
})
