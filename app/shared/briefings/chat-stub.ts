/**
 * localStorage-backed ChatClient for development.
 *
 * Mirrors what Collin's API will provide (see chat-api.ts). The stub keeps
 * the briefing UI working without the gp-api backend, simulating real SSE
 * streaming with chunked timers.
 *
 * Storage layout:
 *   gp.briefings.chat.conversations -> ChatConversation[]
 *   gp.briefings.chat.messages.<conversationId> -> ChatMessage[]
 *   gp.briefings.chat.annotation_map -> { [annotationId]: conversationId }
 *
 * Legacy `create` is retained alongside the new `ChatClient` shape because
 * `annotations-stub.ts` still calls it directly when creating a chat-kind
 * annotation. Once that file moves to the real API, the legacy method can
 * be removed.
 */

'use client'

import type { ChatClient } from './chat-client'
import type { ChatStreamEvent } from './chat-events'
import type { ChatConversation, ChatMessage } from './types'
import { newId, nowIso, safeStorage } from './storage-utils'

const CONV_KEY = 'gp.briefings.chat.conversations'
const MSG_PREFIX = 'gp.briefings.chat.messages.'
const ANNOTATION_MAP_KEY = 'gp.briefings.chat.annotation_map'
const DEV_USER_ID = 1
const CANNED_REPLY =
  "Here's what I can tell from the briefing context. Wire this to the real assistant once Collin's chat API is available."
const STREAM_DELAY_MS = 60
const STREAM_TICKS = 10

function readConvs(): ChatConversation[] {
  const s = safeStorage()
  if (!s) return []
  const raw = s.getItem(CONV_KEY)
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as ChatConversation[]
    return []
  } catch {
    return []
  }
}

function writeConvs(items: ChatConversation[]) {
  const s = safeStorage()
  if (!s) return
  s.setItem(CONV_KEY, JSON.stringify(items))
}

function readMsgs(conversationId: string): ChatMessage[] {
  const s = safeStorage()
  if (!s) return []
  const raw = s.getItem(MSG_PREFIX + conversationId)
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as ChatMessage[]
    return []
  } catch {
    return []
  }
}

function writeMsgs(conversationId: string, items: ChatMessage[]) {
  const s = safeStorage()
  if (!s) return
  s.setItem(MSG_PREFIX + conversationId, JSON.stringify(items))
}

function readAnnotationMap(): Record<string, string> {
  const s = safeStorage()
  if (!s) return {}
  const raw = s.getItem(ANNOTATION_MAP_KEY)
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>
    }
    return {}
  } catch {
    return {}
  }
}

function writeAnnotationMap(map: Record<string, string>) {
  const s = safeStorage()
  if (!s) return
  s.setItem(ANNOTATION_MAP_KEY, JSON.stringify(map))
}

function conversationIdForAnnotation(annotationId: string): string | null {
  const map = readAnnotationMap()
  return map[annotationId] ?? null
}

function recordAnnotationConversation(
  annotationId: string,
  conversationId: string,
) {
  const map = readAnnotationMap()
  map[annotationId] = conversationId
  writeAnnotationMap(map)
}

function makeConversation(): ChatConversation {
  const id = newId('conv')
  const now = nowIso()
  return {
    id,
    ownerUserId: DEV_USER_ID,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  }
}

function persistConversation(conv: ChatConversation) {
  const convs = readConvs()
  convs.push(conv)
  writeConvs(convs)
}

async function legacyCreate({
  initialMessage,
}: {
  initialMessage?: string | null
}): Promise<ChatConversation> {
  const conversation = makeConversation()
  persistConversation(conversation)
  if (initialMessage && initialMessage.length > 0) {
    const now = nowIso()
    const userMsg: ChatMessage = {
      id: newId('msg'),
      conversationId: conversation.id,
      role: 'user',
      content: initialMessage,
      createdAt: now,
    }
    const assistantMsg: ChatMessage = {
      id: newId('msg'),
      conversationId: conversation.id,
      role: 'assistant',
      content: CANNED_REPLY,
      createdAt: new Date(Date.now() + 600).toISOString(),
    }
    writeMsgs(conversation.id, [userMsg, assistantMsg])
  } else {
    writeMsgs(conversation.id, [])
  }
  return conversation
}

function softDeleteConversation(conversationId: string) {
  const convs = readConvs()
  const idx = convs.findIndex((c) => c.id === conversationId)
  if (idx < 0) return
  const existing = convs[idx]
  if (!existing) return
  convs[idx] = {
    ...existing,
    deletedAt: nowIso(),
    updatedAt: nowIso(),
  }
  writeConvs(convs)
}

function chunkReply(text: string, parts: number): string[] {
  if (parts <= 1) return [text]
  const step = Math.max(1, Math.ceil(text.length / parts))
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += step) {
    chunks.push(text.slice(i, i + step))
  }
  return chunks
}

interface ChatStubLegacy {
  /**
   * Legacy: used by annotations-stub.ts to mint a fresh chat conversation
   * before storing a chat-kind annotation row. New code should use
   * `createBriefingChat` instead.
   */
  create(input: { initialMessage?: string | null }): Promise<ChatConversation>
  /**
   * Legacy: lets annotations-stub.ts record the annotation->conversation
   * mapping after it mints the annotation row, so that `softDelete` and
   * `listMessages` can resolve the conversation from the annotation id.
   */
  recordAnnotationConversation(
    annotationId: string,
    conversationId: string,
  ): void
}

export const chatStub: ChatClient & ChatStubLegacy = {
  async createBriefingChat({ meetingDate: _meetingDate, anchor: _anchor }) {
    const conversation = makeConversation()
    persistConversation(conversation)
    const annotationId = newId('ann')
    recordAnnotationConversation(annotationId, conversation.id)
    return { annotationId, conversationId: conversation.id }
  },

  async listMessages(annotationId) {
    // Stub accepts either an annotationId (new API) or a conversationId
    // (legacy callers) so existing code paths keep working until the
    // annotations layer migrates to the real API.
    const conversationId =
      conversationIdForAnnotation(annotationId) ?? annotationId
    return readMsgs(conversationId)
  },

  async *streamMessage({
    annotationId,
    content,
    signal,
  }): AsyncGenerator<ChatStreamEvent, void, void> {
    const conversationId =
      conversationIdForAnnotation(annotationId) ?? annotationId
    const userMsg: ChatMessage = {
      id: newId('msg'),
      conversationId,
      role: 'user',
      content,
      createdAt: nowIso(),
    }
    const msgs = readMsgs(conversationId)
    msgs.push(userMsg)
    writeMsgs(conversationId, msgs)

    const chunks = chunkReply(CANNED_REPLY, STREAM_TICKS)
    let assembled = ''
    for (const delta of chunks) {
      if (signal?.aborted) {
        yield {
          type: 'error',
          code: 'aborted',
          message: 'Stream cancelled.',
          retryable: false,
        }
        return
      }
      await new Promise<void>((r) => setTimeout(r, STREAM_DELAY_MS))
      assembled += delta
      yield { type: 'text', delta }
    }

    const assistantMsg: ChatMessage = {
      id: newId('msg'),
      conversationId,
      role: 'assistant',
      content: assembled,
      createdAt: nowIso(),
    }
    const after = readMsgs(conversationId)
    after.push(assistantMsg)
    writeMsgs(conversationId, after)
    yield { type: 'done', assistantMessageId: assistantMsg.id }
  },

  async softDelete(annotationId) {
    const conversationId = conversationIdForAnnotation(annotationId)
    if (!conversationId) {
      // No map entry — caller passed a conversationId by mistake or the
      // annotation was created outside the briefing chat flow. Warn so the
      // bug surfaces in dev rather than silently soft-deleting nothing.
      console.warn(
        '[chat-stub] softDelete: no conversation mapped for annotation',
        annotationId,
      )
      return
    }
    softDeleteConversation(conversationId)
  },

  // Legacy entry point preserved for annotations-stub.ts.
  create: legacyCreate,
  recordAnnotationConversation,
}
