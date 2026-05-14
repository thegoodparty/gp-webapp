/**
 * Interface for the AI chat client, owned by Collin's team.
 *
 * Stub lives in chat-stub.ts. When Collin ships his real API, swap the
 * implementation by replacing the export site (no other code changes).
 */

import type { ChatConversation, ChatMessage } from './types'

export interface ChatClient {
  create(input: { initialMessage?: string | null }): Promise<ChatConversation>
  listMessages(conversationId: string): Promise<ChatMessage[]>
  sendMessage(conversationId: string, content: string): Promise<ChatMessage>
  softDelete(conversationId: string): Promise<void>
}
