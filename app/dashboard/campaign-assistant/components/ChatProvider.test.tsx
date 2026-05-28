import { useContext } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { render } from 'helpers/test-utils/render'
import { mswServer } from 'helpers/test-utils/api-mocking'
import { ChatContext, ChatProvider } from './ChatProvider'

vi.mock('helpers/analyticsHelper', async () => {
  const actual = await vi.importActual<object>('helpers/analyticsHelper')
  return {
    ...actual,
    trackEvent: vi.fn(),
  }
})

const CHAT_LIST_URL = '/api/v1/campaigns/ai/chat'
const CHAT_THREAD_URL = '/api/v1/campaigns/ai/chat/:threadId'

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
      <div data-testid="should-type">{String(ctx.shouldType)}</div>
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
      <button onClick={() => ctx.finishTyping()}>finish</button>
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
  })

  it('exposes default context values before any action runs', () => {
    renderProvider()

    // The provider initializes threadId to an empty string (not null) and
    // flips to null only after a hydrate that returns no threads.
    expect(screen.getByTestId('thread-id')).toHaveTextContent('empty')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('should-type')).toHaveTextContent('false')
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

  it('handleNewInput creates a new thread on the first message', async () => {
    const user = userEvent.setup()
    mswServer.use(
      http.post(CHAT_LIST_URL, () =>
        HttpResponse.json({
          threadId: 'thread-new',
          chat: [
            { role: 'user', content: 'hello world' },
            { role: 'assistant', content: 'glad to help' },
          ],
        }),
      ),
    )

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'send' }))

    expect(await screen.findByText('thread-new')).toBeInTheDocument()
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(2)
    expect(messages[0]).toHaveTextContent('hello world')
    expect(messages[1]).toHaveTextContent('glad to help')
    expect(screen.getByTestId('should-type')).toHaveTextContent('true')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
  })

  it('handleNewInput keeps the optimistic user message and clears loading when the create call fails at the network layer', async () => {
    const user = userEvent.setup()
    // `HttpResponse.error()` simulates a network error so that the
    // `ajaxActions` try/catch path triggers and `createInitialChat`
    // returns `false`. Returning a 5xx JSON body would NOT trip the
    // catch (clientFetch swallows non-2xx) and the provider would crash
    // trying to destructure `result.chat` — that's a separate latent bug
    // worth tracking, not exercised here.
    mswServer.use(http.post(CHAT_LIST_URL, () => HttpResponse.error()))

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'send' }))

    await screen.findByText('hello world')
    const messages = screen.getByTestId('chat-messages').children
    expect(messages).toHaveLength(1)
    expect(messages[0]).toHaveTextContent('hello world')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    // threadId remains the initial empty string when no new thread was returned.
    expect(screen.getByTestId('thread-id')).toHaveTextContent('empty')
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

  it('finishTyping flips shouldType back to false', async () => {
    const user = userEvent.setup()
    mswServer.use(
      http.post(CHAT_LIST_URL, () =>
        HttpResponse.json({
          threadId: 'thread-new',
          chat: [
            { role: 'user', content: 'hello world' },
            { role: 'assistant', content: 'glad to help' },
          ],
        }),
      ),
    )

    renderProvider()
    await user.click(screen.getByRole('button', { name: 'send' }))
    await screen.findByText('glad to help')
    expect(screen.getByTestId('should-type')).toHaveTextContent('true')

    await user.click(screen.getByRole('button', { name: 'finish' }))
    expect(screen.getByTestId('should-type')).toHaveTextContent('false')
  })
})
