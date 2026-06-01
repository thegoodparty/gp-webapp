import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import ChatMessage from './ChatMessage'

vi.mock('helpers/analyticsHelper', async () => {
  const actual = await vi.importActual<object>('helpers/analyticsHelper')
  return { ...actual, trackEvent: vi.fn() }
})

const renderAssistant = (content: string, isStreaming = false) =>
  render(
    <ChatMessage
      message={{ role: 'assistant', content }}
      isLastMessage={false}
      isStreaming={isStreaming}
    />,
  )

describe('<ChatMessage>', () => {
  it('renders a markdown link as a safe new-tab anchor', () => {
    renderAssistant(
      'Check the [Campaign Tracker](https://goodparty.org/dashboard).',
    )

    const link = screen.getByRole('link', { name: 'Campaign Tracker' })
    expect(link).toHaveAttribute('href', 'https://goodparty.org/dashboard')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('strips scripts and event handlers from model-authored HTML', () => {
    const { container } = renderAssistant(
      '<p>Hello <img src="x" onerror="alert(1)" />' +
        '<a href="https://goodparty.org" target="_blank">resource</a></p>' +
        '<script>alert(2)</script>',
    )

    // Dangerous nodes/attributes are removed by DOMPurify.
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('img')?.getAttribute('onerror')).toBeNull()

    // Surviving new-tab links are forced to a safe rel by the sanitize hook.
    const link = screen.getByRole('link', { name: 'resource' })
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('hides the copy and regenerate controls while streaming', () => {
    renderAssistant('still typing', true)

    expect(screen.queryByLabelText('Copy message')).not.toBeInTheDocument()
    expect(
      screen.queryByLabelText('Regenerate response'),
    ).not.toBeInTheDocument()
  })
})
