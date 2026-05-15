import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import AskAiSheet from './AskAiSheet'
import type { OverlayState } from './AnnotationsScope'
import type { ChatStreamEvent } from '@shared/briefings/chat-events'
import type { ChatMessage } from '@shared/briefings/types'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'

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

function fakeAnchor(): ResolvedAnchor {
  return {
    jsonPath: 'agenda.0.title',
    start: 0,
    end: 5,
    quote: 'hello',
    rect: {
      top: 100,
      left: 100,
      bottom: 120,
      right: 200,
      width: 100,
      height: 20,
      x: 100,
      y: 100,
      toJSON() {
        return this
      },
    } as DOMRect,
  }
}

function anchoredSheet(): OverlayState {
  return { kind: 'ask_ai_anchored', anchor: fakeAnchor() }
}

function existingSheet(annotationId: string): OverlayState {
  return { kind: 'ask_ai_existing', annotationId }
}

function existingSheetWithQuote(
  annotationId: string,
  quote: string,
): OverlayState {
  return {
    kind: 'ask_ai_existing',
    annotationId,
    quote,
    anchor: { jsonPath: 'agenda.0.title', start: 0, end: quote.length },
  }
}

function setupEmptyHistory() {
  mockChatApi.createBriefingChat.mockResolvedValue({
    annotationId: 'ann_1',
    conversationId: 'conv_1',
  })
  mockChatApi.listMessages.mockResolvedValue([])
}

function setupPriorHistory(messages: ChatMessage[]) {
  mockChatApi.createBriefingChat.mockResolvedValue({
    annotationId: 'ann_1',
    conversationId: 'conv_1',
  })
  mockChatApi.listMessages.mockResolvedValue(messages)
}

describe('<AskAiSheet>', () => {
  beforeEach(() => {
    mockChatApi.createBriefingChat.mockReset()
    mockChatApi.listMessages.mockReset()
    mockChatApi.streamMessage.mockReset()
    mockChatApi.softDelete.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('creates the briefing chat once when opened with an anchored selection', async () => {
    setupEmptyHistory()

    render(
      <AskAiSheet
        sheet={anchoredSheet()}
        meetingDate="briefing_x"
        onClose={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(mockChatApi.createBriefingChat).toHaveBeenCalledTimes(1)
    })
    expect(mockChatApi.createBriefingChat).toHaveBeenCalledWith({
      meetingDate: 'briefing_x',
      anchor: { jsonPath: 'agenda.0.title', start: 0, end: 5 },
    })
    expect(mockChatApi.listMessages).toHaveBeenCalledWith('ann_1')
  })

  it('renders the empty state with the suggested pills on first open', async () => {
    setupEmptyHistory()

    render(
      <AskAiSheet
        sheet={anchoredSheet()}
        meetingDate="briefing_x"
        onClose={vi.fn()}
      />,
    )

    const heading = await screen.findByRole('heading', { name: /ask ai/i })
    expect(heading).toHaveTextContent(/^Ask AI$/)
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

  it('renders the resolved quote when reopening an existing chat annotation', async () => {
    setupPriorHistory([])

    render(
      <AskAiSheet
        sheet={existingSheetWithQuote('ann_existing', 'rebuilt quote')}
        meetingDate="briefing_x"
        onClose={vi.fn()}
      />,
    )

    expect(await screen.findByText(/rebuilt quote/)).toBeInTheDocument()
  })

  it('renders the anchor quote below the title when one is present', async () => {
    setupEmptyHistory()

    render(
      <AskAiSheet
        sheet={anchoredSheet()}
        meetingDate="briefing_x"
        onClose={vi.fn()}
      />,
    )

    const heading = await screen.findByRole('heading', { name: /ask ai/i })
    expect(heading).not.toHaveTextContent(/hello/)
    expect(screen.getByText(/hello/)).toBeInTheDocument()
  })

  it('skips create and loads existing messages for an existing-chat overlay', async () => {
    const messages: ChatMessage[] = [
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
    ]
    setupPriorHistory(messages)

    render(
      <AskAiSheet
        sheet={existingSheet('ann_existing')}
        meetingDate="briefing_x"
        onClose={vi.fn()}
      />,
    )

    expect(await screen.findByText('previous question')).toBeInTheDocument()
    expect(await screen.findByText('previous answer')).toBeInTheDocument()
    expect(mockChatApi.createBriefingChat).not.toHaveBeenCalled()
    expect(mockChatApi.listMessages).toHaveBeenCalledWith('ann_existing')
  })

  it('streams assistant text progressively after the user sends a message', async () => {
    const user = userEvent.setup()
    setupEmptyHistory()
    mockChatApi.streamMessage.mockReturnValue(
      scriptedStream([
        { type: 'text', delta: 'Hello' },
        { type: 'text', delta: ' there' },
        { type: 'done', assistantMessageId: 'asst_99' },
      ]),
    )

    render(
      <AskAiSheet
        sheet={anchoredSheet()}
        meetingDate="briefing_x"
        onClose={vi.fn()}
      />,
    )

    const composer = await screen.findByPlaceholderText(/ask a question/i)
    await user.type(composer, 'What is on the agenda?')
    await user.click(screen.getByRole('button', { name: /^ask ai$/i }))

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
    }
    expect(arg.annotationId).toBe('ann_1')
    expect(arg.content).toBe('What is on the agenda?')
  })

  it('shows an inline error UI with retry for retryable errors', async () => {
    const user = userEvent.setup()
    setupEmptyHistory()
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

    render(
      <AskAiSheet
        sheet={anchoredSheet()}
        meetingDate="briefing_x"
        onClose={vi.fn()}
      />,
    )

    const composer = await screen.findByPlaceholderText(/ask a question/i)
    await user.type(composer, 'ping')
    await user.click(screen.getByRole('button', { name: /^ask ai$/i }))

    expect(
      await screen.findByText('Too many requests. Try again in a moment.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('passes the current anchor through onChatCreated so the mirror still writes when create resolves after close', async () => {
    let resolveCreate: (value: {
      annotationId: string
      conversationId: string
    }) => void = vi.fn()
    mockChatApi.createBriefingChat.mockReturnValue(
      new Promise<{ annotationId: string; conversationId: string }>(
        (resolve) => {
          resolveCreate = resolve
        },
      ),
    )
    mockChatApi.listMessages.mockResolvedValue([])

    const onChatCreated = vi.fn()
    const anchorState = anchoredSheet()

    render(
      <AskAiSheet
        sheet={anchorState}
        meetingDate="briefing_x"
        onClose={vi.fn()}
        onChatCreated={onChatCreated}
      />,
    )

    await waitFor(() => {
      expect(mockChatApi.createBriefingChat).toHaveBeenCalledTimes(1)
    })

    // Resolve the create after the parent could have closed the sheet — the
    // sheet must still pass the anchor it captured at mount.
    resolveCreate({ annotationId: 'ann_late', conversationId: 'conv_late' })

    await waitFor(() => {
      expect(onChatCreated).toHaveBeenCalledTimes(1)
    })
    expect(onChatCreated).toHaveBeenCalledWith({
      annotationId: 'ann_late',
      conversationId: 'conv_late',
      anchor: {
        jsonPath: 'agenda.0.title',
        start: 0,
        end: 5,
      },
    })
  })

  it('aborts an in-flight stream when the sheet is closed via Escape', async () => {
    const user = userEvent.setup()
    setupEmptyHistory()
    const { iter, close } = controllableStream()
    mockChatApi.streamMessage.mockReturnValueOnce(iter)
    const onClose = vi.fn()

    const { unmount } = render(
      <AskAiSheet
        sheet={anchoredSheet()}
        meetingDate="briefing_x"
        onClose={onClose}
      />,
    )

    const composer = await screen.findByPlaceholderText(/ask a question/i)
    await user.type(composer, 'long answer')
    await user.click(screen.getByRole('button', { name: /^ask ai$/i }))

    await waitFor(() => {
      expect(mockChatApi.streamMessage).toHaveBeenCalledTimes(1)
    })
    const signal = (
      mockChatApi.streamMessage.mock.calls[0]?.[0] as { signal?: AbortSignal }
    ).signal
    expect(signal).toBeInstanceOf(AbortSignal)
    expect(signal?.aborted).toBe(false)

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()

    // Simulate the parent responding to onClose by removing the sheet from
    // the DOM — this is what AnnotationsScope does in production. The
    // AskAiChatBody unmount cleanup effect fires ctrl.abort().
    unmount()

    await waitFor(() => {
      expect(signal?.aborted).toBe(true)
    })

    close()
  })
})
