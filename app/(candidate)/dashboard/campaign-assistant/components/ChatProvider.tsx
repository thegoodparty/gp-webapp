'use client'
import {
  createContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  RefObject,
} from 'react'
import {
  createInitialChat,
  fetchChatHistory,
  getChatThread,
  regenerateChatThread,
  ChatMessage,
  Chat,
  ChatThread,
  Feedback,
} from 'app/(candidate)/dashboard/campaign-assistant/components/ajaxActions'
import { trackEvent } from 'helpers/analyticsHelper'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export async function updateChat(
  threadId: string,
  input: string,
): Promise<{ message: ChatMessage } | false> {
  try {
    const payload = {
      threadId,
      message: input,
    }
    const resp = await clientFetch<{ message: ChatMessage }>(
      apiRoutes.campaign.chat.update,
      payload,
    )
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

interface ChatContextValue {
  chat: ChatMessage[]
  chats: Chat[]
  loading: boolean
  shouldType: boolean
  loadInitialChats: () => Promise<void>
  setShouldType: (v: boolean) => void
  threadId: string | null
  setThreadId: (v: string | null) => void
  setChat: (v: ChatMessage[]) => void
  scrollDown: () => void
  scrollUp: () => void
  loadChatByThreadId: (threadId: string) => Promise<void>
  handleNewInput: (input: string) => Promise<void>
  handleRegenerate: () => Promise<void>
  feedback: Feedback | null
  scrollingThreadRef: RefObject<HTMLDivElement | null>
  finishTyping: () => void
}

export const ChatContext = createContext<ChatContextValue>({
  chat: [],
  chats: [],
  loading: false,
  shouldType: false,
  loadInitialChats: async () => {},
  setShouldType: () => {},
  threadId: null,
  setThreadId: () => {},
  setChat: () => {},
  scrollDown: () => {},
  scrollUp: () => {},
  loadChatByThreadId: async () => {},
  handleNewInput: async () => {},
  handleRegenerate: async () => {},
  feedback: null,
  scrollingThreadRef: { current: null },
  finishTyping: () => {},
})

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider = ({
  children,
}: ChatProviderProps): React.JSX.Element => {
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(false)
  const [shouldType, setShouldType] = useState(false)
  const [threadId, setThreadId] = useState<string | null>('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const scrollingThreadRef = useRef<HTMLDivElement | null>(null)

  const scrollDown = () =>
    scrollingThreadRef.current &&
    scrollingThreadRef.current.scrollTo({
      behavior: 'smooth',
      top: scrollingThreadRef.current.scrollHeight + 16,
    })

  const scrollUp = () =>
    scrollingThreadRef.current &&
    scrollingThreadRef.current.scrollTo({
      behavior: 'smooth',
      top: 0,
    })

  const finishTyping = () => {
    setShouldType(false)
  }

  useEffect(() => {
    chat?.length && scrollDown()
  }, [chat, shouldType])

  const loadInitialChats = async () => {
    const result = await fetchChatHistory()
    const fetchedChats = result ? result.chats : undefined
    let currentChat: ChatThread | undefined
    let threadId: string | undefined
    if (fetchedChats && fetchedChats.length > 0) {
      threadId = fetchedChats[0]!.threadId
      const threadResult = await getChatThread({ threadId })
      if (threadResult) {
        currentChat = threadResult
      }
    }
    setChats(fetchedChats || [])
    setChat(currentChat?.chat || [])
    setFeedback(currentChat?.feedback || null)
    setThreadId(threadId || null)
  }

  const handleNewInput = async (input: string) => {
    const userMessage: ChatMessage = { role: 'user', content: input }
    const updatedChat = [...chat, userMessage]
    trackEvent('campaign_assistant_chatbot_input', { input })
    setChat(updatedChat)
    setLoading(true)
    if (!threadId || chat.length === 0) {
      const result = await createInitialChat(input)
      if (result) {
        const { threadId: newThreadId, chat: newChat } = result
        setThreadId(newThreadId)
        setChat(newChat)
      }
    } else {
      const result = await updateChat(threadId, input)
      if (result) {
        setChat([...updatedChat, result.message])
      }
    }
    setLoading(false)
    setShouldType(true)
  }

  const loadChatByThreadId = async (threadId: string) => {
    const currentChat = await getChatThread({ threadId })
    if (currentChat) {
      setChat(currentChat.chat || [])
      setFeedback(currentChat.feedback || null)
    } else {
      setChat([])
      setFeedback(null)
    }
    setThreadId(threadId)
  }

  const regenerateChat = async () => {
    if (!threadId) return
    const result = await regenerateChatThread(threadId)
    if (result) {
      const updatedChat = chat.slice(0, -1)
      updatedChat.push(result.message)
      setChat(updatedChat)
    }
  }

  const handleRegenerate = async () => {
    setLoading(true)
    setChat(chat.slice(0, -1))
    await regenerateChat()
    setShouldType(true)
    setLoading(false)
  }

  return (
    <ChatContext.Provider
      value={{
        chat,
        chats,
        loading,
        feedback,
        shouldType,
        threadId,
        setThreadId,
        setChat,
        scrollingThreadRef,
        scrollDown,
        scrollUp,
        loadInitialChats,
        loadChatByThreadId,
        handleNewInput,
        handleRegenerate,
        finishTyping,
        setShouldType,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
