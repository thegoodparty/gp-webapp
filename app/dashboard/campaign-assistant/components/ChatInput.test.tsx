import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { render } from 'helpers/test-utils/render'
import ChatInput from './ChatInput'

const mockHandleNewInput = vi.fn()
const mockScrollUp = vi.fn()
const mockTrackEvent = vi.fn()

vi.mock('app/dashboard/campaign-assistant/components/useChat', () => ({
  default: () => ({
    handleNewInput: mockHandleNewInput,
    loading: false,
    scrollUp: mockScrollUp,
  }),
}))

vi.mock('helpers/analyticsHelper', () => ({
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
  EVENTS: {
    AIAssistant: {
      AskQuestion: 'ai_assistant_ask_question',
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ChatInput', () => {
  it('renders the input field and scroll up button', () => {
    render(<ChatInput />)

    expect(
      screen.getByPlaceholderText('Ask me anything about your campaign...'),
    ).toBeInTheDocument()
    // Find the Fab button (scroll up) which has the MuiFab-root class
    const scrollButton = screen
      .getAllByRole('button')
      .find((btn) => btn.classList.contains('MuiFab-root'))
    expect(scrollButton).toBeDefined()
  })

  it('calls scrollUp when the Fab button is clicked', async () => {
    const user = userEvent.setup()
    render(<ChatInput />)

    const scrollButton = screen
      .getAllByRole('button')
      .find((btn) => btn.classList.contains('MuiFab-root'))
    expect(scrollButton).toBeDefined()

    await user.click(scrollButton!)
    expect(mockScrollUp).toHaveBeenCalledTimes(1)
  })

  it('submits the form and calls handleNewInput with the text', async () => {
    const user = userEvent.setup()
    render(<ChatInput />)

    const input = screen.getByPlaceholderText(
      'Ask me anything about your campaign...',
    )
    await user.type(input, 'test question')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(mockHandleNewInput).toHaveBeenCalledWith('test question')
    })
  })

  it('tracks the AskQuestion event on submit', async () => {
    const user = userEvent.setup()
    render(<ChatInput />)

    const input = screen.getByPlaceholderText(
      'Ask me anything about your campaign...',
    )
    await user.type(input, 'my campaign question')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('ai_assistant_ask_question', {
        text: 'my campaign question',
      })
    })
  })

  it('clears the input after submission', async () => {
    const user = userEvent.setup()
    render(<ChatInput />)

    const input = screen.getByPlaceholderText(
      'Ask me anything about your campaign...',
    ) as HTMLInputElement
    await user.type(input, 'test question')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })

  describe('scroll button positioning', () => {
    it('has the scroll button container with responsive classes for mobile/desktop layout', () => {
      render(<ChatInput />)

      const scrollButton = screen
        .getAllByRole('button')
        .find((btn) => btn.classList.contains('MuiFab-root'))
      const scrollButtonContainer = scrollButton?.parentElement

      // Verify the container has the responsive classes:
      // - flex justify-center mb-2: for mobile (button above input)
      // - lg:absolute lg:bottom-[10px] lg:pb-6 lg:left-[-40px] lg:mb-0: for desktop (button to left)
      expect(scrollButtonContainer).toHaveClass('flex')
      expect(scrollButtonContainer).toHaveClass('justify-center')
      expect(scrollButtonContainer).toHaveClass('mb-2')
      expect(scrollButtonContainer).toHaveClass('lg:absolute')
      expect(scrollButtonContainer).toHaveClass('lg:left-[-40px]')
    })
  })
})

describe('ChatInput when loading', () => {
  beforeEach(() => {
    vi.doMock('app/dashboard/campaign-assistant/components/useChat', () => ({
      default: () => ({
        handleNewInput: mockHandleNewInput,
        loading: true,
        scrollUp: mockScrollUp,
      }),
    }))
  })

  it('shows loading indicator when loading', async () => {
    // Re-import the component with loading: true mock
    vi.resetModules()
    vi.doMock('app/dashboard/campaign-assistant/components/useChat', () => ({
      default: () => ({
        handleNewInput: mockHandleNewInput,
        loading: true,
        scrollUp: mockScrollUp,
      }),
    }))
    vi.doMock('helpers/analyticsHelper', () => ({
      trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
      EVENTS: {
        AIAssistant: {
          AskQuestion: 'ai_assistant_ask_question',
        },
      },
    }))

    const { default: ChatInputLoading } = await import('./ChatInput')
    render(<ChatInputLoading />)

    const input = screen.getByPlaceholderText(
      'Ask me anything about your campaign...',
    )
    expect(input).toBeDisabled()
  })
})
