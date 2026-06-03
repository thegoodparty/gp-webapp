import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { LoadingAnimation } from './LoadingAnimation'

describe('LoadingAnimation', () => {
  it('renders default title when no title prop given', () => {
    render(<LoadingAnimation />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders a custom string title', () => {
    render(<LoadingAnimation title="Please wait" />)
    expect(screen.getByText('Please wait')).toBeInTheDocument()
  })

  it('renders a ReactNode title', () => {
    render(
      <LoadingAnimation title={<span data-testid="custom-title">Hi</span>} />,
    )
    expect(screen.getByTestId('custom-title')).toBeInTheDocument()
  })

  it('renders the label when provided', () => {
    render(<LoadingAnimation label="Building your plan" />)
    expect(screen.getByText('Building your plan')).toBeInTheDocument()
  })

  it('does not render the label element when label is not provided', () => {
    const { container } = render(<LoadingAnimation />)
    expect(container.querySelector('h3')).not.toBeInTheDocument()
  })

  it('renders the GoodParty logo', () => {
    render(<LoadingAnimation />)
    expect(screen.getByAltText('GoodParty.org')).toBeInTheDocument()
  })

  it('renders the indeterminate progress bar', () => {
    const { container } = render(<LoadingAnimation />)
    const bar = container.querySelector(
      '.animate-\\[indeterminate_1\\.5s_ease-in-out_infinite\\]',
    )
    expect(bar).toBeInTheDocument()
  })
})
