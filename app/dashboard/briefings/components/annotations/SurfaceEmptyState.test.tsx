import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SurfaceEmptyState } from './SurfaceEmptyState'

describe('<SurfaceEmptyState>', () => {
  it('renders the label and the message', () => {
    render(
      <SurfaceEmptyState
        label="No notes yet"
        message="Highlight a passage in the briefing to add one."
      />,
    )
    expect(screen.getByText('No notes yet')).toBeInTheDocument()
    expect(
      screen.getByText('Highlight a passage in the briefing to add one.'),
    ).toBeInTheDocument()
  })

  it('exposes a stable test hook via data-testid="surface-empty-state"', () => {
    render(<SurfaceEmptyState label="A" message="B" />)
    expect(screen.getByTestId('surface-empty-state')).toBeInTheDocument()
  })
})
