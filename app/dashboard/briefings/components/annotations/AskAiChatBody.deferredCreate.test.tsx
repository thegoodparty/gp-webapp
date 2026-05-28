import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import type {
  ChatErrorCode,
  ChatStreamEvent,
} from '@shared/briefings/chat-events'
import AskAiChatBody from './AskAiChatBody'
import { EMPTY_ANCHOR } from '@shared/briefings/anchorResolver'

// Stub `chatApi` so we can drive create / stream behavior from each test
// and assert what the body actually fired.
const createMock = vi.fn()
const listMessagesMock = vi.fn()
const streamMessageMock = vi.fn()
const softDeleteMock = vi.fn()
const sendInterruptMock = vi.fn()

vi.mock('@shared/briefings/chat-api', () => ({
  chatApi: {
    createBriefingChat: (...args: unknown[]) => createMock(...args),
    listMessages: (...args: unknown[]) => listMessagesMock(...args),
    streamMessage: (...args: unknown[]) => streamMessageMock(...args),
    softDelete: (...args: unknown[]) => softDeleteMock(...args),
    sendInterrupt: (...args: unknown[]) => sendInterruptMock(...args),
  },
}))

// Silence Sentry — we don't care about side effects, only the API calls.
vi.mock('@shared/sentry', () => ({ reportErrorToSentry: vi.fn() }))

// `useDictationAppend` reaches for browser APIs; stub it to a no-op for
// these unit tests.
vi.mock('../../shared/useDictationAppend', () => ({
  useDictationAppend: () => ({
    isRecording: false,
    error: null,
    start: vi.fn(),
    stop: vi.fn(),
  }),
}))

const MEETING_DATE = '2026-06-08'

// Builds a stream that emits a tiny "ok" assistant turn so `sendContent`
// resolves cleanly. Each test gets a fresh generator.
function makeOkStream(): AsyncIterable<ChatStreamEvent> {
  return (async function* () {
    yield { type: 'text', delta: 'ok' } as ChatStreamEvent
    yield {
      type: 'done',
      assistantMessageId: 'asst_1',
    } as ChatStreamEvent
  })()
}

function makeErrorStream(code: ChatErrorCode): AsyncIterable<ChatStreamEvent> {
  return (async function* () {
    yield {
      type: 'error',
      code,
      retryable: true,
    } as ChatStreamEvent
  })()
}

beforeEach(() => {
  createMock.mockReset()
  listMessagesMock.mockReset()
  streamMessageMock.mockReset()
  softDeleteMock.mockReset()
  sendInterruptMock.mockReset()
})

describe('<AskAiChatBody> deferred creation', () => {
  it('does NOT call chatApi.createBriefingChat on mount when no annotationIdOverride is given', async () => {
    render(
      <AskAiChatBody
        meetingDate={MEETING_DATE}
        anchor={null}
        composerVariant="block"
        active
      />,
    )

    // Composer is interactive immediately (no annotationId required to
    // type into it).
    const textarea = await screen.findByLabelText(/ask assistant message/i)
    expect(textarea).not.toBeDisabled()

    // No server call has fired.
    expect(createMock).not.toHaveBeenCalled()
    expect(listMessagesMock).not.toHaveBeenCalled()
  })

  it('mints the chat row when the user sends their first message, then streams it', async () => {
    const user = userEvent.setup()
    const onChatCreated = vi.fn()
    createMock.mockResolvedValue({
      annotationId: 'ann_new_1',
      conversationId: 'conv_new_1',
    })
    streamMessageMock.mockReturnValue(makeOkStream())

    render(
      <AskAiChatBody
        meetingDate={MEETING_DATE}
        anchor={null}
        composerVariant="block"
        onChatCreated={onChatCreated}
        active
      />,
    )

    const textarea = await screen.findByLabelText(/ask assistant message/i)
    await user.type(textarea, 'what is on the agenda')
    await user.click(screen.getByRole('button', { name: /ask assistant/i }))

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1))
    expect(createMock).toHaveBeenCalledWith({
      meetingDate: MEETING_DATE,
      anchor: EMPTY_ANCHOR,
    })

    // After create, stream fires with the freshly-minted annotation id.
    await waitFor(() => expect(streamMessageMock).toHaveBeenCalledTimes(1))
    expect(streamMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        annotationId: 'ann_new_1',
        content: 'what is on the agenda',
      }),
    )

    // The cache-invalidation callback is fired exactly once, AFTER the
    // first user send (not on mount).
    await waitFor(() => expect(onChatCreated).toHaveBeenCalledTimes(1))
    expect(onChatCreated).toHaveBeenCalledWith({
      annotationId: 'ann_new_1',
      conversationId: 'conv_new_1',
    })
  })

  it('does not call create twice if the user double-taps Send', async () => {
    const user = userEvent.setup()
    // Hold the create promise in flight so the second click can race.
    let resolveCreate!: (v: {
      annotationId: string
      conversationId: string
    }) => void
    createMock.mockImplementation(
      () =>
        new Promise<{ annotationId: string; conversationId: string }>(
          (resolve) => {
            resolveCreate = resolve
          },
        ),
    )
    streamMessageMock.mockReturnValue(makeOkStream())

    render(
      <AskAiChatBody
        meetingDate={MEETING_DATE}
        anchor={null}
        composerVariant="block"
        active
      />,
    )

    const textarea = await screen.findByLabelText(/ask assistant message/i)
    await user.type(textarea, 'hi')
    const sendBtn = screen.getByRole('button', { name: /ask assistant/i })
    await user.click(sendBtn)
    // Second click happens while the first create is still pending.
    await user.click(sendBtn)

    expect(createMock).toHaveBeenCalledTimes(1)
    // Resolve so the test cleans up.
    resolveCreate({
      annotationId: 'ann_dup_guard',
      conversationId: 'conv_dup_guard',
    })
    await waitFor(() => expect(streamMessageMock).toHaveBeenCalledTimes(1))
  })

  it('surfaces a retryable error when create-on-send fails AND keeps the user message in history for retry', async () => {
    const user = userEvent.setup()
    createMock.mockRejectedValue(new Error('boom'))

    render(
      <AskAiChatBody
        meetingDate={MEETING_DATE}
        anchor={null}
        composerVariant="block"
        active
      />,
    )

    const textarea = await screen.findByLabelText(/ask assistant message/i)
    await user.type(textarea, 'first try')
    await user.click(screen.getByRole('button', { name: /ask assistant/i }))

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toMatch(/could not start chat/i)

    // The optimistic user bubble stays so the retry can resume.
    expect(screen.getByText('first try')).toBeInTheDocument()

    // Now retry — create succeeds, stream emits.
    createMock.mockReset()
    createMock.mockResolvedValue({
      annotationId: 'ann_retry',
      conversationId: 'conv_retry',
    })
    streamMessageMock.mockReturnValue(makeOkStream())
    await user.click(screen.getByRole('button', { name: /^retry$/i }))

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(streamMessageMock).toHaveBeenCalledTimes(1))
    expect(streamMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        annotationId: 'ann_retry',
        content: 'first try',
      }),
    )
  })

  it('reuses the same annotationId for a second send (does not re-create)', async () => {
    const user = userEvent.setup()
    createMock.mockResolvedValue({
      annotationId: 'ann_reuse',
      conversationId: 'conv_reuse',
    })
    streamMessageMock
      .mockReturnValueOnce(makeOkStream())
      .mockReturnValueOnce(makeOkStream())

    render(
      <AskAiChatBody
        meetingDate={MEETING_DATE}
        anchor={null}
        composerVariant="block"
        active
      />,
    )

    const textarea = await screen.findByLabelText(/ask assistant message/i)
    await user.type(textarea, 'first')
    await user.click(screen.getByRole('button', { name: /ask assistant/i }))
    await waitFor(() => expect(streamMessageMock).toHaveBeenCalledTimes(1))

    // Send a second message — create must NOT fire again, stream uses
    // the same id.
    await user.type(textarea, 'second')
    await user.click(screen.getByRole('button', { name: /ask assistant/i }))
    await waitFor(() => expect(streamMessageMock).toHaveBeenCalledTimes(2))
    expect(createMock).toHaveBeenCalledTimes(1)
    expect(streamMessageMock.mock.calls[1][0]).toMatchObject({
      annotationId: 'ann_reuse',
      content: 'second',
    })
  })
})

describe('<AskAiChatBody> override path still works', () => {
  it('loads prior messages from an existing chat when annotationIdOverride is provided, without minting a new row', async () => {
    listMessagesMock.mockResolvedValue([
      { id: 'm1', role: 'user', content: 'historical question' },
      { id: 'm2', role: 'assistant', content: 'historical answer' },
    ])

    render(
      <AskAiChatBody
        meetingDate={MEETING_DATE}
        anchor={null}
        annotationIdOverride="ann_existing"
        composerVariant="block"
        active
      />,
    )

    await waitFor(() => expect(listMessagesMock).toHaveBeenCalledTimes(1))
    expect(listMessagesMock).toHaveBeenCalledWith('ann_existing')
    expect(createMock).not.toHaveBeenCalled()
    expect(await screen.findByText('historical question')).toBeInTheDocument()
    expect(screen.getByText('historical answer')).toBeInTheDocument()

    // Suppress unused-variable lint on the error-path stub.
    void makeErrorStream
  })
})
