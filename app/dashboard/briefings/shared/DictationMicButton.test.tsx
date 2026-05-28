import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DictationMicButton } from './DictationMicButton'
import type { UseDictationAppendResult } from './useDictationAppend'

function makeDictation(
  overrides: Partial<UseDictationAppendResult> = {},
): UseDictationAppendResult {
  return {
    status: 'idle',
    error: null,
    partialTranscript: '',
    active: false,
    busy: false,
    start: vi.fn(async () => undefined),
    stop: vi.fn(async () => undefined),
    toggle: vi.fn(async () => undefined),
    ...overrides,
  }
}

describe('<DictationMicButton>', () => {
  it('renders with the idle aria-label when status is idle', () => {
    render(
      <DictationMicButton
        dictation={makeDictation()}
        idleLabel="Dictate note"
        recordingLabel="Stop dictation"
      />,
    )
    expect(
      screen.getByRole('button', { name: /dictate note/i }),
    ).toBeInTheDocument()
  })

  it('renders with the recording aria-label when status is recording', () => {
    render(
      <DictationMicButton
        dictation={makeDictation({ status: 'recording', active: true })}
        idleLabel="Dictate note"
        recordingLabel="Stop dictation"
      />,
    )
    expect(
      screen.getByRole('button', { name: /stop dictation/i }),
    ).toBeInTheDocument()
  })

  it('renders a red, blinking stop icon while recording', () => {
    render(
      <DictationMicButton
        dictation={makeDictation({ status: 'recording', active: true })}
        idleLabel="Dictate note"
        recordingLabel="Stop dictation"
      />,
    )
    const icon = screen
      .getByRole('button', { name: /stop dictation/i })
      .querySelector('svg')
    expect(icon?.getAttribute('class')).toMatch(/text-red-500/)
    expect(icon?.getAttribute('class')).toMatch(/animate-pulse/)
  })

  it('invokes toggle when clicked', async () => {
    const user = userEvent.setup()
    const toggle = vi.fn(async () => undefined)
    render(
      <DictationMicButton
        dictation={makeDictation({ toggle })}
        idleLabel="Dictate note"
        recordingLabel="Stop dictation"
      />,
    )
    await user.click(screen.getByRole('button', { name: /dictate note/i }))
    expect(toggle).toHaveBeenCalledTimes(1)
  })

  it('is disabled when status is stopping', () => {
    render(
      <DictationMicButton
        dictation={makeDictation({
          status: 'stopping',
          active: true,
          busy: true,
        })}
        idleLabel="Dictate note"
        recordingLabel="Stop dictation"
      />,
    )
    expect(screen.getByRole('button', { name: /dictate note/i })).toBeDisabled()
  })

  it('respects the disabled prop from the caller', () => {
    render(
      <DictationMicButton
        dictation={makeDictation()}
        idleLabel="Dictate note"
        recordingLabel="Stop dictation"
        disabled
      />,
    )
    expect(screen.getByRole('button', { name: /dictate note/i })).toBeDisabled()
  })

  it('positions absolute bottom-2 right-2 by default', () => {
    render(
      <DictationMicButton
        dictation={makeDictation()}
        idleLabel="Dictate note"
        recordingLabel="Stop dictation"
      />,
    )
    const btn = screen.getByRole('button', { name: /dictate note/i })
    expect(btn.className).toMatch(/absolute/)
    expect(btn.className).toMatch(/bottom-2/)
    expect(btn.className).toMatch(/right-2/)
  })

  it('allows a custom className to override the default placement', () => {
    render(
      <DictationMicButton
        dictation={makeDictation()}
        idleLabel="Dictate note"
        recordingLabel="Stop dictation"
        className="some-other-class"
      />,
    )
    const btn = screen.getByRole('button', { name: /dictate note/i })
    expect(btn.className).toMatch(/some-other-class/)
  })
})

describe('<DictationFeedback>', () => {
  it('renders the partial transcript with aria-live=polite', async () => {
    const { DictationFeedback } = await import('./DictationFeedback')
    render(
      <DictationFeedback
        dictation={makeDictation({ partialTranscript: 'hi there' })}
      />,
    )
    const partial = screen.getByText('hi there')
    expect(partial.getAttribute('aria-live')).toBe('polite')
  })

  it('renders the error with role=alert', async () => {
    const { DictationFeedback } = await import('./DictationFeedback')
    render(
      <DictationFeedback dictation={makeDictation({ error: 'mic blocked' })} />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('mic blocked')
  })

  it('uses text-sm sizing on the error (matches saveError styling)', async () => {
    const { DictationFeedback } = await import('./DictationFeedback')
    render(
      <DictationFeedback dictation={makeDictation({ error: 'mic blocked' })} />,
    )
    const alert = screen.getByRole('alert')
    expect(alert.className).toMatch(/text-sm/)
  })

  it('renders nothing when there is no partial transcript and no error', async () => {
    const { DictationFeedback } = await import('./DictationFeedback')
    const { container } = render(
      <DictationFeedback dictation={makeDictation()} />,
    )
    expect(container.textContent).toBe('')
  })
})
