import { useContext } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { render } from 'helpers/test-utils/render'
import { mswServer } from 'helpers/test-utils/api-mocking'
import { ChatContext, ChatProvider } from './ChatProvider'
import { streamChat, type ChatStreamEvent } from './ajaxActions'

vi.mock('helpers/analyticsHelper', async () => {
  const actual = await vi.importActual<object>('helpers/analyticsHelper')
  return {
    ...actual,
    trackEvent: vi.fn(),
  }
})

vi.mock('./ajaxActions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./ajaxActions')>()
  return {
    ...actual,
    streamChat: vi.fn(),
  }
})

const CHAT_LIST_URL = '/api/v1/campaigns/ai/chat'
const CHAT_THREAD_URL = '/api/v1/campaigns/ai/chat/:threadId'

/** Builds a mock SSE generator that yields the provided events in order. */
const mockStream = (events: ChatStreamEvent[]) =>
  vi.mocked(streamChat).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/require-await
    async function* () {
      for (const event of events) {
        yield event
      }
    },
  )

const Consumer = () => {
  const ctx = useContext(ChatContext)
  return (
    <div>
      <div data-testid="thread-id">
        {ctx.threadId === null
          ? 'null'
          : ctx.threadId === ''
            ? 'empty'
            : ctx.threadId}
      </div>
      <div data-testid="loading">{String(ctx.loading)}</div>
      <div data-testid="error">{ctx.error ? ctx.error.message : 'none'}</div>
      <div data-testid="chats-count">{ctx.chats.length}</div>
      <ul data-testid="chat-messages">
        {ctx.chat.map((m, i) => (
          <li key={i} data-role={m.role}>
            {m.content}
          </li>
        ))}
      </ul>
      <button onClick={() => void ctx.loadInitialChats()}>load</button>
      <button onClick={() => void ctx.handleNewInput('hello world')}>
        send
      </button>
      <button onClick={() => void ctx.loadChatByThreadId('thread-2')}>
        switch
      </button>
      <button onClick={() => void ctx.handleRegenerate()}>regen</button>
      <button onClick={() => void ctx.retryLast()}>retry</button>
    </div>
  )
}

const renderProvider = () =>
  render(
    <ChatProvider>
      <Consumer />
    </ChatProvider>,
  )

describe('<ChatProvider>', () => {
  beforeEach(() => {
    // jsdom doesn't implement scrollTo; the provider scrolls a ref that we
    // never attach, but the implementation still calls .scrollTo on null
    // checks. Be defensive.
    Element.prototype.scrollTo = vi.fn()
    vi.mocked(streamChat).mockReset()
  })

  it('exposes default context values before any action runs', () => {
    renderProvider()

    // The provider initializes threadId to an empty string (not null) and
    // flips to null only after a hydrate that returns no threads.
    expect(screen.getByTestId('thread-id')).toHaveTextContent('empty')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('error')).toHaveTextContent('none')
    expect(screen.getByTestId('chats-count')).toHaveTextContent('0')
    expect(screen.getByTestId('chat-messages').children).toHaveLength(0)
  })

  it('loadInitialChats fetches the chat list and hydrates the first thread', async () => {
    const user = userEvent.setup()
    mswServer.use(
      http.get(CHAT_LIST_URL, () =>
        HttpResponse.json({
          chats: [
            {
              threadId: 'thread-1',
              name: 'First chat',
              updatedAt: '2026-05-01T00:00:00.000Z',
            },
          ],
        }),
      ),
      http.get(CHAT_THREAD_URL, () =>
        HttpResponse.json({
          threadId: 'thread-1',
          chat: [
            { role: 'user', content: 'hi there' },
            { role: 'assistant', content: 'hello back' },
          ],
        }),
      ),
    )

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'load' }))

    expect(await screen.findByText('thread-1')).toBeInTheDocument()
    expect(screen.getByTestId('chats-count')).toHaveTextContent('1')
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(2)
    expect(messages[0]).toHaveTextContent('hi there')
    expect(messages[1]).toHaveTextContent('hello back')
  })

  it('loadInitialChats resets state when the API returns no chats', async () => {
    const user = userEvent.setup()
    mswServer.use(
      http.get(CHAT_LIST_URL, () => HttpResponse.json({ chats: [] })),
    )

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'load' }))

    // The empty-list response resets threadId to null (distinct from the
    // initial empty-string state).
    await screen.findByText('null')
    expect(screen.getByTestId('chats-count')).toHaveTextContent('0')
    expect(screen.getByTestId('chat-messages').children).toHaveLength(0)
  })

  it('handleNewInput streams a new thread on the first message', async () => {
    const user = userEvent.setup()
    mockStream([
      { type: 'text', delta: 'glad ' },
      { type: 'text', delta: 'to help' },
      {
        type: 'done',
        threadId: 'thread-new',
        message: { role: 'assistant', content: 'glad to help' },
      },
    ])

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'send' }))

    expect(await screen.findByText('thread-new')).toBeInTheDocument()
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(2)
    expect(messages[0]).toHaveTextContent('hello world')
    expect(messages[1]).toHaveTextContent('glad to help')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(vi.mocked(streamChat)).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'hello world', initial: true }),
    )
  })

  it('handleNewInput keeps the optimistic user message and surfaces an error when the stream fails', async () => {
    const user = userEvent.setup()
    mockStream([
      {
        type: 'error',
        code: 'upstream_unavailable',
        message: 'Chat is temporarily unavailable.',
        retryable: true,
      },
    ])

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'send' }))

    await screen.findByText('hello world')
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(1)
    expect(messages[0]).toHaveTextContent('hello world')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Chat is temporarily unavailable.',
    )
    // threadId remains the initial empty string when no new thread was returned.
    expect(screen.getByTestId('thread-id')).toHaveTextContent('empty')
  })

  it('retryLast re-runs the previous stream request', async () => {
    const user = userEvent.setup()
    mockStream([
      {
        type: 'error',
        code: 'upstream_unavailable',
        message: 'Chat is temporarily unavailable.',
        retryable: true,
      },
    ])

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'send' }))
    await screen.findByText('Chat is temporarily unavailable.')

    mockStream([
      {
        type: 'done',
        threadId: 'thread-new',
        message: { role: 'assistant', content: 'recovered reply' },
      },
    ])
    await user.click(screen.getByRole('button', { name: 'retry' }))

    expect(await screen.findByText('recovered reply')).toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent('none')
    expect(vi.mocked(streamChat)).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: 'hello world', initial: true }),
    )
  })

  it('loadChatByThreadId swaps the active thread and replaces messages', async () => {
    const user = userEvent.setup()
    mswServer.use(
      http.get(CHAT_THREAD_URL, () =>
        HttpResponse.json({
          threadId: 'thread-2',
          chat: [{ role: 'assistant', content: 'switched thread reply' }],
        }),
      ),
    )

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'switch' }))

    expect(await screen.findByText('thread-2')).toBeInTheDocument()
    expect(await screen.findByText('switched thread reply')).toBeInTheDocument()
  })

  it('handleNewInput streams a follow-up on an existing thread', async () => {
    const user = userEvent.setup()
    mswServer.use(
      http.get(CHAT_THREAD_URL, () =>
        HttpResponse.json({
          threadId: 'thread-2',
          chat: [{ role: 'assistant', content: 'switched thread reply' }],
        }),
      ),
    )

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'switch' }))
    expect(await screen.findByText('thread-2')).toBeInTheDocument()
    await screen.findByText('switched thread reply')

    mockStream([
      {
        type: 'done',
        threadId: 'thread-2',
        message: { role: 'assistant', content: 'follow-up reply' },
      },
    ])
    await user.click(screen.getByRole('button', { name: 'send' }))

    expect(await screen.findByText('follow-up reply')).toBeInTheDocument()
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(3)
    expect(messages[0]).toHaveTextContent('switched thread reply')
    expect(messages[1]).toHaveTextContent('hello world')
    expect(messages[2]).toHaveTextContent('follow-up reply')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(vi.mocked(streamChat)).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'hello world', threadId: 'thread-2' }),
    )
  })

  it('handleRegenerate replaces the last assistant message via a regenerate stream', async () => {
    const user = userEvent.setup()
    mswServer.use(
      http.get(CHAT_THREAD_URL, () =>
        HttpResponse.json({
          threadId: 'thread-2',
          chat: [
            { role: 'user', content: 'first question' },
            { role: 'assistant', content: 'original reply' },
          ],
        }),
      ),
    )

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'switch' }))
    await screen.findByText('original reply')

    mockStream([
      {
        type: 'done',
        threadId: 'thread-2',
        message: { role: 'assistant', content: 'regenerated reply' },
      },
    ])
    await user.click(screen.getByRole('button', { name: 'regen' }))

    expect(await screen.findByText('regenerated reply')).toBeInTheDocument()
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(2)
    expect(messages[0]).toHaveTextContent('first question')
    expect(messages[1]).toHaveTextContent('regenerated reply')
    expect(screen.queryByText('original reply')).not.toBeInTheDocument()
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(vi.mocked(streamChat)).toHaveBeenCalledWith(
      expect.objectContaining({ threadId: 'thread-2', regenerate: true }),
    )
  })

  it('commits the partial reply and surfaces no error when the stream is stopped mid-flight', async () => {
    const user = userEvent.setup()
    // A user-stop closes the stream after some deltas; the generator's final
    // event is an `aborted` error, which the provider ignores while still
    // committing whatever text had streamed so far.
    mockStream([
      { type: 'text', delta: 'partial ' },
      { type: 'text', delta: 'reply' },
      {
        type: 'error',
        code: 'aborted',
        message: 'Stream cancelled.',
        retryable: false,
      },
    ])

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'send' }))

    expect(await screen.findByText('partial reply')).toBeInTheDocument()
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(2)
    expect(messages[0]).toHaveTextContent('hello world')
    expect(messages[1]).toHaveTextContent('partial reply')
    expect(screen.getByTestId('error')).toHaveTextContent('none')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
  })

  it('restores the previous reply when a regenerate stream fails with nothing committed', async () => {
    const user = userEvent.setup()
    mswServer.use(
      http.get(CHAT_THREAD_URL, () =>
        HttpResponse.json({
          threadId: 'thread-2',
          chat: [
            { role: 'user', content: 'first question' },
            { role: 'assistant', content: 'original reply' },
          ],
        }),
      ),
    )

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'switch' }))
    await screen.findByText('original reply')

    mockStream([
      {
        type: 'error',
        code: 'upstream_unavailable',
        message: 'Chat is temporarily unavailable.',
        retryable: true,
      },
    ])
    await user.click(screen.getByRole('button', { name: 'regen' }))

    // The optimistically-removed reply is restored, not lost.
    expect(await screen.findByText('original reply')).toBeInTheDocument()
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(2)
    expect(messages[1]).toHaveTextContent('original reply')
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Chat is temporarily unavailable.',
    )
  })

  it('replaces (does not duplicate) the reply when retrying a regenerate that first failed', async () => {
    const user = userEvent.setup()
    mswServer.use(
      http.get(CHAT_THREAD_URL, () =>
        HttpResponse.json({
          threadId: 'thread-2',
          chat: [
            { role: 'user', content: 'first question' },
            { role: 'assistant', content: 'original reply' },
          ],
        }),
      ),
    )

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'switch' }))
    await screen.findByText('original reply')

    // First regenerate fails — the original reply is restored.
    mockStream([
      {
        type: 'error',
        code: 'upstream_unavailable',
        message: 'temporarily down',
        retryable: true,
      },
    ])
    await user.click(screen.getByRole('button', { name: 'regen' }))
    await screen.findByText('temporarily down')
    expect(screen.getByText('original reply')).toBeInTheDocument()

    // Retrying the regenerate must slice the restored reply, not append to it.
    mockStream([
      {
        type: 'done',
        threadId: 'thread-2',
        message: { role: 'assistant', content: 'regenerated reply' },
      },
    ])
    await user.click(screen.getByRole('button', { name: 'retry' }))

    expect(await screen.findByText('regenerated reply')).toBeInTheDocument()
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(2)
    expect(messages[0]).toHaveTextContent('first question')
    expect(messages[1]).toHaveTextContent('regenerated reply')
    expect(screen.queryByText('original reply')).not.toBeInTheDocument()
  })

  it('handleRegenerate is a no-op when there is no active threadId', async () => {
    const user = userEvent.setup()

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'regen' }))

    expect(screen.getByTestId('chat-messages').children).toHaveLength(0)
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(vi.mocked(streamChat)).not.toHaveBeenCalled()
  })
})
