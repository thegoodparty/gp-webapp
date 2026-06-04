import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StyledAlert } from '@shared/alerts/StyledAlert'

describe('StyledAlert', () => {
  it('renders children', () => {
    render(<StyledAlert severity="info">Hello world</StyledAlert>)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('applies info token classes', () => {
    const { container } = render(
      <StyledAlert severity="info">Info</StyledAlert>,
    )
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/text-info-dark/)
    expect(alert?.className).toMatch(/bg-info-background/)
    expect(alert?.className).toMatch(/border-info-dark/)
  })

  it('applies error token classes', () => {
    const { container } = render(
      <StyledAlert severity="error">Error</StyledAlert>,
    )
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/text-error-dark/)
    expect(alert?.className).toMatch(/bg-error-background/)
    expect(alert?.className).toMatch(/border-error-dark/)
  })

  it('applies warning token classes', () => {
    const { container } = render(
      <StyledAlert severity="warning">Warning</StyledAlert>,
    )
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/text-warning-dark/)
    expect(alert?.className).toMatch(/bg-warning-background/)
    expect(alert?.className).toMatch(/border-warning-dark/)
  })

  it('applies success token classes', () => {
    const { container } = render(
      <StyledAlert severity="success">Success</StyledAlert>,
    )
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/text-success-dark/)
    expect(alert?.className).toMatch(/bg-success-background/)
    expect(alert?.className).toMatch(/border-success-dark/)
  })

  it('accepts an optional custom icon', () => {
    render(
      <StyledAlert severity="info" icon={<span data-testid="custom-icon" />}>
        With icon
      </StyledAlert>,
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('accepts and forwards className', () => {
    const { container } = render(
      <StyledAlert severity="info" className="extra-class">
        Styled
      </StyledAlert>,
    )
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert?.className).toMatch(/extra-class/)
  })

  it('ignores variant prop without throwing', () => {
    expect(() =>
      render(
        <StyledAlert severity="info" variant="outlined">
          No throw
        </StyledAlert>,
      ),
    ).not.toThrow()
  })
})
