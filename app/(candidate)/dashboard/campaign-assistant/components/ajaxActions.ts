import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface ChatMessage {
  role: string
  content: string
}

interface Feedback {
  type: string
}

interface Chat {
  threadId: string
  name: string
  updatedAt: string
}

interface ChatThread {
  threadId: string
  chat: ChatMessage[]
  feedback?: Feedback
}

interface ChatHistory {
  chats: Chat[]
}

interface ChatResponse {
  threadId: string
  chat: ChatMessage[]
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

export async function createInitialChat(message: string): Promise<ChatResponse | false> {
  try {
    const payload = { message, initial: true }
    const resp = await clientFetch<ChatResponse>(apiRoutes.campaign.chat.create, payload)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function getChatThread({ threadId }: { threadId: string }): Promise<ChatThread | false> {
  try {
    const payload = { threadId }
    const resp = await clientFetch<ChatThread>(apiRoutes.campaign.chat.get, payload)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function regenerateChatThread(threadId: string): Promise<{ message: ChatMessage } | false> {
  try {
    const payload = { threadId, regenerate: true }
    const resp = await clientFetch<{ message: ChatMessage }>(apiRoutes.campaign.chat.update, payload)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function deleteThread(threadId: string): Promise<{ message: ChatMessage } | false> {
  try {
    const payload = { threadId }
    const resp = await clientFetch<{ message: ChatMessage }>(apiRoutes.campaign.chat.delete, payload)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function chatFeedback(threadId: string, type: string, message: string): Promise<{ message: ChatMessage } | false> {
  try {
    const payload = { threadId, message, type }
    const resp = await clientFetch<{ message: ChatMessage }>(apiRoutes.campaign.chat.feedback, payload)
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}
