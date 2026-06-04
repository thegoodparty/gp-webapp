import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorAlert } from '@shared/alerts/ErrorAlert'

describe('ErrorAlert', () => {
  it('renders children', () => {
    render(<ErrorAlert>Something went wrong</ErrorAlert>)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('applies error severity token classes', () => {
    const { container } = render(<ErrorAlert>Error text</ErrorAlert>)
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/text-error-dark/)
    expect(alert?.className).toMatch(/bg-error-background/)
    expect(alert?.className).toMatch(/border-error-dark/)
  })

  it('forwards className', () => {
    const { container } = render(
      <ErrorAlert className="mb-6">Error</ErrorAlert>,
    )
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/mb-6/)
  })

  it('renders an icon', () => {
    const { container } = render(<ErrorAlert>With icon</ErrorAlert>)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
