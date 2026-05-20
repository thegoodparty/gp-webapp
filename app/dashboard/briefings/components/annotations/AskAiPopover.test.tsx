import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { Button } from '@styleguide'
import AskAiPopover from './AskAiPopover'
import type { ChatStreamEvent } from '@shared/briefings/chat-events'
import type { ChatMessage } from '@shared/briefings/types'

type MockChatApi = {
  createBriefingChat: ReturnType<typeof vi.fn>
  listMessages: ReturnType<typeof vi.fn>
  streamMessage: ReturnType<typeof vi.fn>
  softDelete: ReturnType<typeof vi.fn>
}

const mockChatApi: MockChatApi = {
  createBriefingChat: vi.fn(),
  listMessages: vi.fn(),
  streamMessage: vi.fn(),
  softDelete: vi.fn(),
}

vi.mock('@shared/briefings/chat-api', () => ({
  chatApi: {
    createBriefingChat: (arg: unknown) =>
      (mockChatApi.createBriefingChat as (a: unknown) => unknown)(arg),
    listMessages: (arg: unknown) =>
      (mockChatApi.listMessages as (a: unknown) => unknown)(arg),
    streamMessage: (arg: unknown) =>
      (mockChatApi.streamMessage as (a: unknown) => unknown)(arg),
    softDelete: (arg: unknown) =>
      (mockChatApi.softDelete as (a: unknown) => unknown)(arg),
  },
}))

function scriptedStream(
  events: ChatStreamEvent[],
): AsyncIterable<ChatStreamEvent> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const ev of events) {
        // Yield each tick on a microtask so React has time to render between
        // them — this mirrors how the real SSE stream behaves.
        await Promise.resolve()
        yield ev
      }
    },
  }
}

function controllableStream(): {
  iter: AsyncIterable<ChatStreamEvent>
  push: (ev: ChatStreamEvent) => void
  close: () => void
} {
  const queue: ChatStreamEvent[] = []
  const waiters: Array<(value: IteratorResult<ChatStreamEvent>) => void> = []
  let closed = false

  function push(ev: ChatStreamEvent) {
    if (closed) return
    if (waiters.length > 0) {
      const w = waiters.shift()
      if (w) w({ value: ev, done: false })
    } else {
      queue.push(ev)
    }
  }

  function close() {
    closed = true
    while (waiters.length > 0) {
      const w = waiters.shift()
      if (w) w({ value: undefined as unknown as ChatStreamEvent, done: true })
    }
  }

  const iter: AsyncIterable<ChatStreamEvent> = {
    [Symbol.asyncIterator]() {
      return {
        next(): Promise<IteratorResult<ChatStreamEvent>> {
          if (queue.length > 0) {
            const value = queue.shift() as ChatStreamEvent
            return Promise.resolve({ value, done: false })
          }
          if (closed) {
            return Promise.resolve({
              value: undefined as unknown as ChatStreamEvent,
              done: true,
            })
          }
          return new Promise((resolve) => {
            waiters.push(resolve)
          })
        },
      }
    },
  }

  return { iter, push, close }
}

function setupAnnotationAndEmptyHistory() {
  mockChatApi.createBriefingChat.mockResolvedValue({
    annotationId: 'ann_1',
    conversationId: 'conv_1',
  })
  mockChatApi.listMessages.mockResolvedValue([])
}

function setupAnnotationAndPriorHistory(messages: ChatMessage[]) {
  mockChatApi.createBriefingChat.mockResolvedValue({
    annotationId: 'ann_1',
    conversationId: 'conv_1',
  })
  mockChatApi.listMessages.mockResolvedValue(messages)
}

function renderPopoverWithTrigger() {
  return render(
    <AskAiPopover
      meetingDate="briefing_x"
      anchor={null}
      trigger={<Button>Ask AI</Button>}
    />,
  )
}

describe('<AskAiPopover>', () => {
  beforeEach(() => {
    mockChatApi.createBriefingChat.mockReset()
    mockChatApi.listMessages.mockReset()
    mockChatApi.streamMessage.mockReset()
    mockChatApi.softDelete.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('creates the briefing chat once when the trigger opens the popover', async () => {
    const user = userEvent.setup()
    setupAnnotationAndEmptyHistory()
    renderPopoverWithTrigger()

    await user.click(screen.getByRole('button', { name: /ask ai/i }))

    await waitFor(() => {
      expect(mockChatApi.createBriefingChat).toHaveBeenCalledTimes(1)
    })
    expect(mockChatApi.createBriefingChat).toHaveBeenCalledWith({
      meetingDate: 'briefing_x',
      anchor: { jsonPath: null, start: null, end: null },
    })
    expect(mockChatApi.listMessages).toHaveBeenCalledWith('ann_1')
  })

  it('renders the empty state with the suggested pills on first open', async () => {
    const user = userEvent.setup()
    setupAnnotationAndEmptyHistory()
    renderPopoverWithTrigger()

    await user.click(screen.getByRole('button', { name: /ask ai/i }))

    expect(await screen.findByText(/briefing assistant/i)).toBeInTheDocument()
    expect(
      screen.getByText(/ask anything about this briefing/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /explain this/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /give me more details/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /verify this/i }),
    ).toBeInTheDocument()
  })

  it('sends the suggestion as a user message when a suggested pill is clicked', async () => {
    const user = userEvent.setup()
    setupAnnotationAndEmptyHistory()
    mockChatApi.streamMessage.mockReturnValue(
      (async function* () {
        yield { type: 'text' as const, delta: 'ok' }
        yield { type: 'done' as const, assistantMessageId: 'asst_1' }
      })(),
    )
    renderPopoverWithTrigger()

    await user.click(screen.getByRole('button', { name: /ask ai/i }))
    await screen.findByText(/briefing assistant/i)

    await user.click(screen.getByRole('button', { name: /explain this/i }))

    expect(await screen.findByText('Explain this')).toBeInTheDocument()
    expect(mockChatApi.streamMessage).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'Explain this' }),
    )
  })

  it('streams assistant text progressively after the user sends a message', async () => {
    const user = userEvent.setup()
    setupAnnotationAndEmptyHistory()
    mockChatApi.streamMessage.mockReturnValue(
      scriptedStream([
        { type: 'text', delta: 'Hello' },
        { type: 'text', delta: ' there' },
        { type: 'done', assistantMessageId: 'asst_99' },
      ]),
    )

    renderPopoverWithTrigger()
    await user.click(screen.getByRole('button', { name: /ask ai/i }))
    await screen.findByText(/briefing assistant/i)

    const composer = await screen.findByPlaceholderText(/ask anything/i)
    await user.type(composer, 'What is on the agenda?')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(
      await screen.findByText('What is on the agenda?'),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Hello there/)).toBeInTheDocument()
    })

    expect(mockChatApi.streamMessage).toHaveBeenCalledTimes(1)
    const arg = mockChatApi.streamMessage.mock.calls[0]?.[0] as {
      annotationId: string
      content: string
      clientMessageId?: string
      signal?: AbortSignal
    }
    expect(arg.annotationId).toBe('ann_1')
    expect(arg.content).toBe('What is on the agenda?')
    expect(typeof arg.clientMessageId).toBe('string')
    expect(arg.clientMessageId?.length).toBeGreaterThan(0)
  })

  it('shows an inline error UI and a retry button when the stream yields a retryable error', async () => {
    const user = userEvent.setup()
    setupAnnotationAndEmptyHistory()
    mockChatApi.streamMessage.mockReturnValueOnce(
      scriptedStream([
        {
          type: 'error',
          code: 'rate_limited',
          message: 'slow down please',
          retryable: true,
        },
      ]),
    )

    renderPopoverWithTrigger()
    await user.click(screen.getByRole('button', { name: /ask ai/i }))
    await screen.findByText(/briefing assistant/i)

    const composer = await screen.findByPlaceholderText(/ask anything/i)
    await user.type(composer, 'ping')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(
      await screen.findByText('Too many requests. Try again in a moment.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('does not show retry when the error is not retryable', async () => {
    const user = userEvent.setup()
    setupAnnotationAndEmptyHistory()
    mockChatApi.streamMessage.mockReturnValueOnce(
      scriptedStream([
        {
          type: 'error',
          code: 'conversation_not_found',
          message: 'gone',
          retryable: false,
        },
      ]),
    )

    renderPopoverWithTrigger()
    await user.click(screen.getByRole('button', { name: /ask ai/i }))
    await screen.findByText(/briefing assistant/i)

    const composer = await screen.findByPlaceholderText(/ask anything/i)
    await user.type(composer, 'ping')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(
      await screen.findByText(
        'This chat is no longer available. Try starting a new one.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /retry/i }),
    ).not.toBeInTheDocument()
  })

  it('retries with the same clientMessageId after a retryable error', async () => {
    const user = userEvent.setup()
    setupAnnotationAndEmptyHistory()
    mockChatApi.streamMessage
      .mockReturnValueOnce(
        scriptedStream([
          {
            type: 'error',
            code: 'upstream_unavailable',
            message: 'try again',
            retryable: true,
          },
        ]),
      )
      .mockReturnValueOnce(
        scriptedStream([{ type: 'text', delta: 'ok' }, { type: 'done' }]),
      )

    renderPopoverWithTrigger()
    await user.click(screen.getByRole('button', { name: /ask ai/i }))
    await screen.findByText(/briefing assistant/i)

    const composer = await screen.findByPlaceholderText(/ask anything/i)
    await user.type(composer, 'ping')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await screen.findByText('Chat is temporarily unavailable. Try again.')

    const firstId = (
      mockChatApi.streamMessage.mock.calls[0]?.[0] as {
        clientMessageId: string
      }
    ).clientMessageId

    await user.click(screen.getByRole('button', { name: /retry/i }))

    await waitFor(() => {
      expect(mockChatApi.streamMessage).toHaveBeenCalledTimes(2)
    })
    const secondId = (
      mockChatApi.streamMessage.mock.calls[1]?.[0] as {
        clientMessageId: string
      }
    ).clientMessageId
    expect(secondId).toBe(firstId)
  })

  it('aborts an in-flight stream when the popover closes', async () => {
    const user = userEvent.setup()
    setupAnnotationAndEmptyHistory()
    const { iter, push: _push, close } = controllableStream()
    mockChatApi.streamMessage.mockReturnValueOnce(iter)

    renderPopoverWithTrigger()
    await user.click(screen.getByRole('button', { name: /ask ai/i }))
    await screen.findByText(/briefing assistant/i)

    const composer = await screen.findByPlaceholderText(/ask anything/i)
    await user.type(composer, 'long answer')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(mockChatApi.streamMessage).toHaveBeenCalledTimes(1)
    })
    const signal = (
      mockChatApi.streamMessage.mock.calls[0]?.[0] as { signal?: AbortSignal }
    ).signal
    expect(signal).toBeInstanceOf(AbortSignal)
    expect(signal?.aborted).toBe(false)

    // ESC closes the popover.
    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(signal?.aborted).toBe(true)
    })

    close()
  })

  it('fires onChatCreated with the popover anchor after createBriefingChat resolves', async () => {
    const user = userEvent.setup()
    setupAnnotationAndEmptyHistory()
    const onChatCreated = vi.fn()

    render(
      <AskAiPopover
        meetingDate="briefing_x"
        anchor={null}
        onChatCreated={onChatCreated}
        trigger={<Button>Ask AI</Button>}
      />,
    )

    await user.click(screen.getByRole('button', { name: /ask ai/i }))

    await waitFor(() => {
      expect(onChatCreated).toHaveBeenCalledTimes(1)
    })
    expect(onChatCreated).toHaveBeenCalledWith({
      annotationId: 'ann_1',
      conversationId: 'conv_1',
      anchor: null,
    })
  })

  it('renders prior conversation when reopened', async () => {
    const user = userEvent.setup()
    setupAnnotationAndPriorHistory([
      {
        id: 'm1',
        conversationId: 'conv_1',
        role: 'user',
        content: 'previous question',
        createdAt: '2026-05-14T00:00:00.000Z',
      },
      {
        id: 'm2',
        conversationId: 'conv_1',
        role: 'assistant',
        content: 'previous answer',
        createdAt: '2026-05-14T00:00:01.000Z',
      },
    ])

    renderPopoverWithTrigger()
    await user.click(screen.getByRole('button', { name: /ask ai/i }))

    expect(await screen.findByText('previous question')).toBeInTheDocument()
    expect(await screen.findByText('previous answer')).toBeInTheDocument()
  })
})
