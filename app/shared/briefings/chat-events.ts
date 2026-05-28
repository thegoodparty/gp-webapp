/**
 * Streaming event shapes returned by the gp-api SSE channel for briefing
 * chats. Mirrors the `ChatStreamChunk` discriminated union on the server.
 *
 * Treat `done` and `error` as terminal — once you see one, close the reader
 * and stop processing further frames.
 */

export type ChatErrorCode =
  | 'conversation_not_found'
  | 'upstream_unavailable'
  | 'rate_limited'
  | 'aborted'
  | 'internal'

export type ChatStreamEvent =
  | { type: 'text'; delta: string }
  | { type: 'tool_call'; toolName: string; args?: unknown }
  | { type: 'tool_result'; toolName: string; result?: unknown }
  | { type: 'done'; assistantMessageId?: string }
  | {
      type: 'error'
      code: ChatErrorCode
      message: string
      retryable: boolean
    }
