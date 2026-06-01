import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import ReadAloudButton from './ReadAloudButton'
import type { ReadAloudStatus } from '../../shared/useReadAloud'

type HookState = {
  status: ReadAloudStatus
  error: string | null
}

const hookState: HookState = { status: 'idle', error: null }
const playMock = vi.fn()
const stopMock = vi.fn()
const prefetchMock = vi.fn()

vi.mock('../../shared/useReadAloud', () => ({
  useReadAloud: () => ({
    status: hookState.status,
    error: hookState.error,
    play: playMock,
    stop: stopMock,
    prefetch: prefetchMock,
  }),
}))

function setHook(state: HookState): void {
  hookState.status = state.status
  hookState.error = state.error
}

describe('<ReadAloudButton>', () => {
  it('prefetches audio on mount to warm the cache before the first click', () => {
    prefetchMock.mockClear()
    setHook({ status: 'idle', error: null })

    render(<ReadAloudButton text="hello" />)

    expect(prefetchMock).toHaveBeenCalledTimes(1)
  })

  describe('compact variant', () => {
    it('renders a spinner and is busy + disabled while loading', () => {
      setHook({ status: 'loading', error: null })

      render(<ReadAloudButton text="hello" compact />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toBeDisabled()
      // IconButton's built-in LoadingSpinner has the `animate-spin` class.
      const spinner = button.querySelector('.animate-spin')
      expect(spinner).not.toBeNull()
    })

    it('shows a destructive-tinted warning indicator on error', () => {
      setHook({ status: 'error', error: 'boom' })

      render(<ReadAloudButton text="hello" compact />)

      const button = screen.getByRole('button', { name: /read aloud failed/i })
      // The warning glyph should be tinted destructive so sighted users see
      // that the previous attempt failed.
      const destructive = button.querySelector('.text-destructive')
      expect(destructive).not.toBeNull()
    })

    it('shows the play icon when idle and is enabled', () => {
      setHook({ status: 'idle', error: null })

      render(<ReadAloudButton text="hello" compact />)

      const button = screen.getByRole('button', { name: /^read aloud$/i })
      expect(button).not.toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'false')
      expect(button.querySelector('.animate-spin')).toBeNull()
    })

    it('shows a stop icon and is enabled while playing', () => {
      setHook({ status: 'playing', error: null })

      render(<ReadAloudButton text="hello" compact />)

      const button = screen.getByRole('button', { name: /stop reading/i })
      expect(button).not.toBeDisabled()
      // Not in the spinner state — content is the stop icon, not LoadingSpinner.
      expect(button.querySelector('.animate-spin')).toBeNull()
    })
  })

  describe('labeled variant', () => {
    it('renders "Try again" text on error', () => {
      setHook({ status: 'error', error: 'boom' })

      render(<ReadAloudButton text="hello" />)

      const button = screen.getByRole('button', { name: /read aloud failed/i })
      expect(button).toHaveTextContent(/try again/i)
      expect(button).not.toHaveTextContent(/^read aloud$/i)
    })

    it('renders "Loading…" while loading', () => {
      setHook({ status: 'loading', error: null })

      render(<ReadAloudButton text="hello" />)

      const button = screen.getByRole('button')
      expect(button).toHaveTextContent(/loading/i)
      expect(button).toBeDisabled()
    })

    it('renders "Read aloud" when idle', () => {
      setHook({ status: 'idle', error: null })

      render(<ReadAloudButton text="hello" />)

      const button = screen.getByRole('button', { name: /^read aloud$/i })
      expect(button).toHaveTextContent(/read aloud/i)
      expect(button).not.toBeDisabled()
    })

    it('renders "Stop" while playing', () => {
      setHook({ status: 'playing', error: null })

      render(<ReadAloudButton text="hello" />)

      const button = screen.getByRole('button', { name: /stop reading/i })
      expect(button).toHaveTextContent(/stop/i)
    })
  })
})
