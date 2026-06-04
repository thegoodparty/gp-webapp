import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FilledErrorAlert } from '@shared/alerts/FilledErrorAlert'

describe('FilledErrorAlert', () => {
  it('renders children', () => {
    render(<FilledErrorAlert>Critical failure</FilledErrorAlert>)
    expect(screen.getByText('Critical failure')).toBeInTheDocument()
  })

  it('applies filled error token classes', () => {
    const { container } = render(<FilledErrorAlert>Error</FilledErrorAlert>)
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/bg-error-main/)
    expect(alert?.className).toMatch(/text-white/)
    expect(alert?.className).toMatch(/border-error-main/)
  })

  it('forwards className', () => {
    const { container } = render(
      <FilledErrorAlert className="mb-4">Error</FilledErrorAlert>,
    )
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/mb-4/)
  })

  it('renders an icon', () => {
    const { container } = render(<FilledErrorAlert>With icon</FilledErrorAlert>)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
