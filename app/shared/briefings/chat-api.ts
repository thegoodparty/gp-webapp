/**
 * Real ChatClient implementation, talks to gp-api over
 * `/v1/briefing-chats`. SSE parsing follows the contract in
 * `gp-api/src/chats/CLIENT_HOOKUP.md`.
 *
 * Auth flow:
 *  - JSON endpoints (create / list / delete) use `clientRequest`, which
 *    routes through the same-origin `/api` proxy (Next.js middleware
 *    injects the Clerk Bearer token).
 *  - SSE streaming uses raw `fetch('/api/v1/...')` because `ofetch` buffers
 *    the response body. The middleware streams the rewrite correctly.
 */

'use client'

import { clientRequest } from 'gpApi/typed-request'
import { reportErrorToSentry } from '@shared/sentry'
import type { ChatClient } from './chat-client'
import type { ChatStreamEvent, ChatErrorCode } from './chat-events'

function errorEvent(
  code: ChatErrorCode,
  message: string,
  retryable: boolean,
): ChatStreamEvent {
  return { type: 'error', code, message, retryable }
}

function statusToErrorEvent(status: number, body: string): ChatStreamEvent {
  if (status === 404) {
    return errorEvent(
      'conversation_not_found',
      'This chat is unavailable. Refresh the briefing.',
      false,
    )
  }
  if (status === 429) {
    return errorEvent(
      'rate_limited',
      'Too many requests. Try again in a moment.',
      true,
    )
  }
  if (status >= 500) {
    return errorEvent(
      'upstream_unavailable',
      'Chat is temporarily unavailable.',
      true,
    )
  }
  reportErrorToSentry(
    new Error(`briefing-chat stream non-ok status ${status}`),
    {
      surface: 'briefing-ask-ai',
      phase: 'stream',
      status,
      body,
    },
  )
  return errorEvent(
    'internal',
    'Something went wrong. Please try again.',
    false,
  )
}

function isChatStreamEvent(value: unknown): value is ChatStreamEvent {
  if (!value || typeof value !== 'object') return false
  const type = (value as { type?: unknown }).type
  return (
    type === 'text' ||
    type === 'tool_call' ||
    type === 'tool_result' ||
    type === 'done' ||
    type === 'error'
  )
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
    try {
      reader.releaseLock()
    } catch {
      // ignore — lock may already be released
    }
  }
}

export const chatApi: ChatClient = {
  async createBriefingChat({ meetingDate, anchor }) {
    const { data } = await clientRequest('POST /v1/briefing-chats', {
      meetingDate,
      anchor,
    })
    return data
  },

  async listMessages(annotationId) {
    const { data } = await clientRequest(
      'GET /v1/briefing-chats/:annotationId',
      {
        annotationId,
      },
    )
    return data.messages
  },

  async softDelete(annotationId) {
    await clientRequest('DELETE /v1/briefing-chats/:annotationId', {
      annotationId,
    })
  },

  async *streamMessage({ annotationId, content, clientMessageId, signal }) {
    let res: Response
    try {
      res = await fetch(
        `/api/v1/briefing-chats/${encodeURIComponent(annotationId)}/messages`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({ content, clientMessageId }),
          signal,
        },
      )
    } catch (err) {
      const aborted =
        err instanceof Error &&
        (err.name === 'AbortError' || signal?.aborted === true)
      if (!aborted) {
        reportErrorToSentry(err, {
          surface: 'briefing-ask-ai',
          phase: 'stream',
          step: 'fetch',
          annotationId,
        })
      }
      yield errorEvent(
        aborted ? 'aborted' : 'upstream_unavailable',
        aborted ? 'Stream cancelled.' : 'Chat is temporarily unavailable.',
        !aborted,
      )
      return
    }

    if (!res.ok) {
      let bodyText = ''
      try {
        bodyText = await res.text()
      } catch {
        bodyText = ''
      }
      yield statusToErrorEvent(res.status, bodyText)
      return
    }

    if (!res.body) {
      yield errorEvent(
        'internal',
        'No response body returned from server.',
        false,
      )
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
          surface: 'briefing-ask-ai',
          phase: 'stream',
          step: 'iterate',
          annotationId,
        })
      }
      yield errorEvent(
        aborted ? 'aborted' : 'internal',
        aborted ? 'Stream cancelled.' : 'Stream interrupted.',
        false,
      )
    }
  },
}
