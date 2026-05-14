/**
 * localStorage-backed ChatClient for development.
 *
 * Mirrors what Collin's API will provide. Canned responder simulates an
 * assistant reply ~600ms after each user message.
 *
 * Storage layout:
 *   gp.briefings.chat.conversations -> ChatConversation[]
 *   gp.briefings.chat.messages.<conversationId> -> ChatMessage[]
 */

'use client'

import type { ChatClient } from './chat-client'
import type { ChatConversation, ChatMessage } from './types'

const CONV_KEY = 'gp.briefings.chat.conversations'
const MSG_PREFIX = 'gp.briefings.chat.messages.'
const DEV_USER_ID = 1
const CANNED_REPLY =
  "Here's what I can tell from the briefing context. Wire this to the real assistant once Collin's chat API is available."

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function newId(prefix: string) {
  return (
    prefix +
    '_' +
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  )
}

function nowIso() {
  return new Date().toISOString()
}

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

export const chatStub: ChatClient = {
  async create({ initialMessage }) {
    const id = newId('conv')
    const now = nowIso()
    const conversation: ChatConversation = {
      id,
      ownerUserId: DEV_USER_ID,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    }
    const convs = readConvs()
    convs.push(conversation)
    writeConvs(convs)
    if (initialMessage && initialMessage.length > 0) {
      const userMsg: ChatMessage = {
        id: newId('msg'),
        conversationId: id,
        role: 'user',
        content: initialMessage,
        createdAt: now,
      }
      const assistantMsg: ChatMessage = {
        id: newId('msg'),
        conversationId: id,
        role: 'assistant',
        content: CANNED_REPLY,
        createdAt: new Date(Date.now() + 600).toISOString(),
      }
      writeMsgs(id, [userMsg, assistantMsg])
    } else {
      writeMsgs(id, [])
    }
    return conversation
  },

  async listMessages(conversationId) {
    return readMsgs(conversationId)
  },

  async sendMessage(conversationId, content) {
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
    // Simulate latency before assistant reply.
    await new Promise((r) => setTimeout(r, 600))
    const assistantMsg: ChatMessage = {
      id: newId('msg'),
      conversationId,
      role: 'assistant',
      content: CANNED_REPLY,
      createdAt: nowIso(),
    }
    const after = readMsgs(conversationId)
    after.push(assistantMsg)
    writeMsgs(conversationId, after)
    return assistantMsg
  },

  async softDelete(conversationId) {
    const convs = readConvs()
    const idx = convs.findIndex((c) => c.id === conversationId)
    if (idx < 0) return
    const existing = convs[idx]
    if (!existing) return
    convs[idx] = { ...existing, deletedAt: nowIso(), updatedAt: nowIso() }
    writeConvs(convs)
  },
}
