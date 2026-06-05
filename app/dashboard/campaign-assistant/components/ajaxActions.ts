import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { buildUrl } from '@shared/utils/buildUrl'
import { reportErrorToSentry } from '@shared/sentry'

export interface ChatMessage {
  role: string
  content: string
}

export type ChatStreamErrorCode =
  | 'upstream_unavailable'
  | 'rate_limited'
  | 'aborted'
  | 'internal'

export type ChatStreamEvent =
  | { type: 'text'; delta: string }
  | { type: 'done'; threadId: string; message: ChatMessage }
  | {
      type: 'error'
      code: ChatStreamErrorCode
      message: string
      retryable: boolean
    }

export interface StreamChatParams {
  message?: string
  threadId?: string
  initial?: boolean
  regenerate?: boolean
  signal?: AbortSignal
}

function streamErrorEvent(
  code: ChatStreamErrorCode,
  message: string,
  retryable: boolean,
): ChatStreamEvent {
  return { type: 'error', code, message, retryable }
}

// Validates the full shape per discriminant, not just `.type`. This is the
// trust boundary for untrusted network data, so a malformed frame (e.g. a
// `text` with no `delta`, or a `done` with no `message`) must be rejected
// rather than relayed — otherwise the consumer accumulates `undefined` or
// dereferences a missing `message.content`.
function isChatStreamEvent(value: unknown): value is ChatStreamEvent {
  if (!value || typeof value !== 'object') return false
  const event = value as Record<string, unknown>
  switch (event.type) {
    case 'text':
      return typeof event.delta === 'string'
    case 'done':
      return (
        typeof event.threadId === 'string' &&
        typeof event.message === 'object' &&
        event.message !== null &&
        typeof (event.message as { content?: unknown }).content === 'string'
      )
    case 'error':
      return (
        typeof event.message === 'string' &&
        typeof event.retryable === 'boolean'
      )
    default:
      return false
  }
}

async function* parseSseStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<ChatStreamEvent, void, void> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const frames = buf.split('\n\n')
      buf = frames.pop() ?? ''
      for (const frame of frames) {
        const trimmed = frame.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue
        const json = trimmed.slice(5).trim()
        if (!json) continue
        let parsed: unknown
        try {
          parsed = JSON.parse(json)
        } catch {
          continue
        }
        if (isChatStreamEvent(parsed)) {
          yield parsed
        }
      }
    }
  } finally {
    // On a `done`/`error` early return the fetch signal is never aborted, so
    // cancel the reader to close the underlying stream — otherwise the SSE
    // connection leaks until the server times out. `cancel()` is a no-op on an
    // already-closed stream.
    try {
      await reader.cancel()
    } catch {
      // ignore — stream may already be closed
    }
    try {
      reader.releaseLock()
    } catch {
      // ignore — lock may already be released
    }
  }
}

/**
 * Streams an assistant reply over SSE from `POST /campaigns/ai/chat/stream`.
 * Yields incremental `text` deltas followed by a terminal `done` (carrying the
 * resolved threadId + final message) or `error` event. Uses raw `fetch` (not
 * `clientFetch`) so the response body is not buffered; auth flows through the
 * same-origin `/api` proxy.
 */
export async function* streamChat({
  message,
  threadId,
  initial,
  regenerate,
  signal,
}: StreamChatParams): AsyncGenerator<ChatStreamEvent, void, void> {
  const url = buildUrl(apiRoutes.campaign.chat.stream)
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ message, threadId, initial, regenerate }),
      signal,
    })
  } catch (err) {
    const aborted =
      err instanceof Error &&
      (err.name === 'AbortError' || signal?.aborted === true)
    if (!aborted) {
      reportErrorToSentry(err, {
        surface: 'campaign-assistant',
        phase: 'stream',
        step: 'fetch',
      })
    }
    yield streamErrorEvent(
      aborted ? 'aborted' : 'upstream_unavailable',
      aborted ? 'Stream cancelled.' : 'Chat is temporarily unavailable.',
      !aborted,
    )
    return
  }

  if (!res.ok) {
    const code: ChatStreamErrorCode =
      res.status === 429
        ? 'rate_limited'
        : res.status >= 500
          ? 'upstream_unavailable'
          : 'internal'
    yield streamErrorEvent(
      code,
      code === 'rate_limited'
        ? 'Too many requests. Try again in a moment.'
        : code === 'upstream_unavailable'
          ? 'Chat is temporarily unavailable.'
          : 'Something went wrong. Please try again.',
      code !== 'internal',
    )
    return
  }

  if (!res.body) {
    yield streamErrorEvent('internal', 'No response from the server.', false)
    return
  }

  try {
    for await (const ev of parseSseStream(res.body)) {
      yield ev
      if (ev.type === 'done' || ev.type === 'error') return
    }
  } catch (err) {
    const aborted =
      err instanceof Error &&
      (err.name === 'AbortError' || signal?.aborted === true)
    if (!aborted) {
      reportErrorToSentry(err, {
        surface: 'campaign-assistant',
        phase: 'stream',
        step: 'iterate',
      })
    }
    yield streamErrorEvent(
      aborted ? 'aborted' : 'internal',
      aborted ? 'Stream cancelled.' : 'Stream interrupted.',
      false,
    )
  }
}

export interface Feedback {
  type: string
}

export interface Chat {
  threadId: string
  name: string
  updatedAt: string
}

export interface ChatThread {
  threadId: string
  chat: ChatMessage[]
  feedback?: Feedback
}

export interface ChatHistory {
  chats: Chat[]
}

export async function fetchChatHistory(): Promise<ChatHistory | false> {
  try {
    const resp = await clientFetch<ChatHistory>(apiRoutes.campaign.chat.list)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function getChatThread({
  threadId,
}: {
  threadId: string
}): Promise<ChatThread | false> {
  try {
    const payload = { threadId }
    const resp = await clientFetch<ChatThread>(
      apiRoutes.campaign.chat.get,
      payload,
    )
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function deleteThread(
  threadId: string,
): Promise<{ message: ChatMessage } | false> {
  try {
    const payload = { threadId }
    const resp = await clientFetch<{ message: ChatMessage }>(
      apiRoutes.campaign.chat.delete,
      payload,
    )
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function chatFeedback(
  threadId: string,
  type: string,
  message: string,
): Promise<{ message: ChatMessage } | false> {
  try {
    const payload = { threadId, message, type }
    const resp = await clientFetch<{ message: ChatMessage }>(
      apiRoutes.campaign.chat.feedback,
      payload,
    )
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}
