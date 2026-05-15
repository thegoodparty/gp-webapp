/**
 * Interface for the AI chat client, owned by Collin's team.
 *
 * Real implementation lives in chat-api.ts and talks to gp-api over
 * `/v1/briefing-chats`. A localStorage-backed stub lives in chat-stub.ts so
 * the briefing UI keeps working without the backend.
 *
 * The two methods that previously existed (`create`, `sendMessage`) have been
 * replaced by `createBriefingChat` (annotation-aware) and `streamMessage`
 * (SSE-streamed).
 */

import type { ChatMessage, AnnotationAnchor } from './types'
import type { ChatStreamEvent } from './chat-events'

export interface ChatClient {
  /**
   * Create a briefing-scoped chat. Returns the annotation id that backs the
   * chat conversation plus the conversation id itself. Subsequent calls must
   * use the returned `annotationId` as the key.
   *
   * Pass `anchor = { jsonPath: null, start: null, end: null }` for a
   * top-level (briefing-scoped) chat that isn't tied to a text selection.
   */
  createBriefingChat(args: {
    meetingDate: string
    anchor: AnnotationAnchor
  }): Promise<{ annotationId: string; conversationId: string }>

  /**
   * Fetch the prior messages on this annotation's conversation, oldest
   * first. Returns an empty array when the chat has no messages yet.
   */
  listMessages(annotationId: string): Promise<ChatMessage[]>

  /**
   * Send a user message and consume the assistant's streamed response. The
   * caller should iterate over the async iterable, treating `done` and
   * `error` as terminal.
   *
   * `clientMessageId` should be a UUID v4 that stays stable across retries
   * of the same logical send so the backend can dedupe.
   */
  streamMessage(args: {
    annotationId: string
    content: string
    clientMessageId?: string
    signal?: AbortSignal
  }): AsyncIterable<ChatStreamEvent>

  /**
   * Soft-delete the conversation behind this annotation. The server marks
   * the underlying `ChatConversation` as deleted; subsequent calls return
   * `conversation_not_found`.
   */
  softDelete(annotationId: string): Promise<void>
}
