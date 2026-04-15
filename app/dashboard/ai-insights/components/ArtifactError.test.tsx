import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArtifactError } from './ArtifactError'

describe('ArtifactError', () => {
  it('displays the error message', () => {
    render(<ArtifactError error="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows Retry button when onRetry is provided', () => {
    render(<ArtifactError error="Failed" onRetry={() => {}} />)
    expect(
      screen.getByRole('button', { name: /retry/i }),
    ).toBeInTheDocument()
  })

  it('calls onRetry when Retry button is clicked', async () => {
    const onRetry = vi.fn()
    render(<ArtifactError error="Failed" onRetry={onRetry} />)

    await userEvent.click(screen.getByRole('button', { name: /retry/i }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('does not show Retry button when onRetry is not provided', () => {
    render(<ArtifactError error="Failed" />)
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument()
  })
})
