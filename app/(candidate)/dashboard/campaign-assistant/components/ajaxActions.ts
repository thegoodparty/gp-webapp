import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface Chat {
  threadId: string
  [key: string]: string | number | boolean | object | null
}

interface ChatHistory {
  chats: Chat[]
}

interface ChatResponse {
  threadId: string
  chat: Chat
}

interface ChatData {
  [key: string]: string | number | boolean | object | null
}

export async function fetchChatHistory(): Promise<ChatHistory | false> {
  try {
    const resp = await clientFetch(apiRoutes.campaign.chat.list)
    return resp.data as ChatHistory
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function createInitialChat(message: string): Promise<ChatResponse | false> {
  try {
    const payload = { message, initial: true }
    const resp = await clientFetch(apiRoutes.campaign.chat.create, payload)
    return resp.data as ChatResponse
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function getChatThread({ threadId }: { threadId: string }): Promise<Chat | false> {
  try {
    const payload = { threadId }
    const resp = await clientFetch(apiRoutes.campaign.chat.get, payload)
    return resp.data as Chat
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function regenerateChatThread(threadId: string): Promise<ChatData | false> {
  try {
    const payload = { threadId, regenerate: true }
    const resp = await clientFetch(apiRoutes.campaign.chat.update, payload)
    return resp.data as ChatData
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function deleteThread(threadId: string): Promise<ChatData | false> {
  try {
    const payload = { threadId }
    const resp = await clientFetch(apiRoutes.campaign.chat.delete, payload)
    return resp.data as ChatData
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function chatFeedback(threadId: string, type: string, message: string): Promise<ChatData | false> {
  try {
    const payload = { threadId, message, type }
    const resp = await clientFetch(apiRoutes.campaign.chat.feedback, payload)
    return resp.data as ChatData
  } catch (e) {
    console.error('error', e)
    return false
  }
}
