import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { chatApi } from './chat-api'
import { api } from 'helpers/test-utils/api-mocking'
import type { ChatStreamEvent } from './chat-events'

type FetchMock = ReturnType<typeof vi.fn>

function asSseResponse(status: number, frames: string[]): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder()
      for (const frame of frames) {
        controller.enqueue(enc.encode(frame))
      }
      controller.close()
    },
  })
  return new Response(stream, {
    status,
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

function asJsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function sse(event: ChatStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`
}

describe('chatApi.createBriefingChat', () => {
  it('POSTs to /v1/briefing-chats with meetingDate + anchor and returns annotationId + conversationId', async () => {
    let receivedBody: unknown
    api.mock('POST /v1/briefing-chats', ({ body }) => {
      receivedBody = body
      return {
        status: 200,
        data: {
          annotationId: 'ann_123',
          conversationId: 'conv_456',
        },
      }
    })

    const result = await chatApi.createBriefingChat({
      meetingDate: 'briefing_abc',
      anchor: { jsonPath: 'agenda.0.title', start: 4, end: 10 },
    })

    expect(result).toEqual({
      annotationId: 'ann_123',
      conversationId: 'conv_456',
    })
    expect(receivedBody).toEqual({
      meetingDate: 'briefing_abc',
      anchor: { jsonPath: 'agenda.0.title', start: 4, end: 10 },
    })
  })

  it('throws when the server responds with a non-2xx status', async () => {
    api.mock('POST /v1/briefing-chats', {
      status: 500,
      data: { message: 'boom' },
    })

    await expect(
      chatApi.createBriefingChat({
        meetingDate: 'b',
        anchor: { jsonPath: null, start: null, end: null },
      }),
    ).rejects.toThrow(/500/)
  })
})

describe('chatApi.listMessages', () => {
  it('GETs the conversation endpoint and returns the messages array', async () => {
    const messages = [
      {
        id: 'm1',
        conversationId: 'c1',
        role: 'user' as const,
        content: 'hi',
        createdAt: '2026-05-14T00:00:00.000Z',
      },
      {
        id: 'm2',
        conversationId: 'c1',
        role: 'assistant' as const,
        content: 'hello',
        createdAt: '2026-05-14T00:00:01.000Z',
      },
    ]
    let receivedAnnotationId: string | undefined
    api.mock('GET /v1/briefing-chats/:annotationId', ({ params }) => {
      receivedAnnotationId = params.annotationId
      return {
        status: 200,
        data: { conversationId: 'c1', messages },
      }
    })

    const result = await chatApi.listMessages('ann_abc')

    expect(result).toEqual(messages)
    expect(receivedAnnotationId).toBe('ann_abc')
  })

  it('throws on non-2xx response', async () => {
    api.mock('GET /v1/briefing-chats/:annotationId', {
      status: 404,
      data: { message: 'gone' },
    })
    await expect(chatApi.listMessages('ann_x')).rejects.toThrow(/404/)
  })
})

describe('chatApi.softDelete', () => {
  it('DELETEs the conversation endpoint and accepts a 200 response', async () => {
    let receivedAnnotationId: string | undefined
    api.mock('DELETE /v1/briefing-chats/:annotationId', ({ params }) => {
      receivedAnnotationId = params.annotationId
      return { status: 200, data: undefined }
    })

    await expect(chatApi.softDelete('ann_abc')).resolves.toBeUndefined()
    expect(receivedAnnotationId).toBe('ann_abc')
  })

  it('throws on non-2xx response', async () => {
    api.mock('DELETE /v1/briefing-chats/:annotationId', {
      status: 500,
      data: { message: 'err' },
    })
    await expect(chatApi.softDelete('ann_x')).rejects.toThrow(/500/)
  })
})

describe('chatApi.streamMessage', () => {
  let fetchMock: FetchMock

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function collect(
    iter: AsyncIterable<ChatStreamEvent>,
  ): Promise<ChatStreamEvent[]> {
    const out: ChatStreamEvent[] = []
    for await (const ev of iter) out.push(ev)
    return out
  }

  it('POSTs to the same-origin /api proxy and parses SSE text + done frames', async () => {
    fetchMock.mockResolvedValueOnce(
      asSseResponse(200, [
        sse({ type: 'text', delta: 'Hello' }),
        sse({ type: 'text', delta: ' world' }),
        sse({ type: 'done', assistantMessageId: 'asst_99' }),
      ]),
    )

    const events = await collect(
      chatApi.streamMessage({
        annotationId: 'ann_abc',
        content: 'tell me',
        clientMessageId: 'uuid-1',
      }),
    )

    expect(events).toEqual([
      { type: 'text', delta: 'Hello' },
      { type: 'text', delta: ' world' },
      { type: 'done', assistantMessageId: 'asst_99' },
    ])

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/v1/briefing-chats/ann_abc/messages')
    expect(init.method).toBe('POST')
    expect(init.credentials).toBe('include')
    expect(JSON.parse(init.body as string)).toEqual({
      content: 'tell me',
      clientMessageId: 'uuid-1',
    })
  })

  it('parses frames split across chunk boundaries', async () => {
    const frame = sse({ type: 'text', delta: 'split' })
    const half = Math.floor(frame.length / 2)
    fetchMock.mockResolvedValueOnce(
      asSseResponse(200, [
        frame.slice(0, half),
        frame.slice(half),
        sse({ type: 'done' }),
      ]),
    )

    const events = await collect(
      chatApi.streamMessage({
        annotationId: 'ann_abc',
        content: 'tell me',
      }),
    )

    expect(events).toEqual([{ type: 'text', delta: 'split' }, { type: 'done' }])
  })

  it('parses tool_call and tool_result frames', async () => {
    fetchMock.mockResolvedValueOnce(
      asSseResponse(200, [
        sse({ type: 'tool_call', toolName: 'search_news' }),
        sse({ type: 'tool_result', toolName: 'search_news' }),
        sse({ type: 'text', delta: 'done' }),
        sse({ type: 'done' }),
      ]),
    )

    const events = await collect(
      chatApi.streamMessage({ annotationId: 'a', content: 'q' }),
    )

    expect(events.map((e) => e.type)).toEqual([
      'tool_call',
      'tool_result',
      'text',
      'done',
    ])
  })

  it('yields an error event when the server returns non-2xx before streaming', async () => {
    fetchMock.mockResolvedValueOnce(
      asJsonResponse(404, { message: 'no conversation' }),
    )

    const events = await collect(
      chatApi.streamMessage({ annotationId: 'a', content: 'q' }),
    )

    expect(events).toHaveLength(1)
    const first = events[0]
    expect(first?.type).toBe('error')
    if (first?.type === 'error') {
      expect(first.code).toBe('conversation_not_found')
      expect(first.retryable).toBe(false)
    }
  })

  it('yields error frames sent by the server as terminal events', async () => {
    fetchMock.mockResolvedValueOnce(
      asSseResponse(200, [
        sse({
          type: 'error',
          code: 'rate_limited',
          message: 'slow down',
          retryable: true,
        }),
      ]),
    )

    const events = await collect(
      chatApi.streamMessage({ annotationId: 'a', content: 'q' }),
    )

    expect(events).toEqual([
      {
        type: 'error',
        code: 'rate_limited',
        message: 'slow down',
        retryable: true,
      },
    ])
  })

  it('forwards the AbortSignal to fetch', async () => {
    fetchMock.mockResolvedValueOnce(asSseResponse(200, [sse({ type: 'done' })]))
    const ctrl = new AbortController()

    await collect(
      chatApi.streamMessage({
        annotationId: 'a',
        content: 'q',
        signal: ctrl.signal,
      }),
    )

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit
    expect(init.signal).toBe(ctrl.signal)
  })
})
