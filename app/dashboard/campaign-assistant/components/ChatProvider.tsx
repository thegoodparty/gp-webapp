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
  fetchChatHistory,
  getChatThread,
  streamChat,
  ChatMessage,
  Chat,
  ChatThread,
  Feedback,
  StreamChatParams,
} from 'app/dashboard/campaign-assistant/components/ajaxActions'
import { noop, noopAsync } from '@shared/utils/noop'
import { trackEvent } from 'helpers/analyticsHelper'

export interface ChatStreamError {
  message: string
  retryable: boolean
}

interface ChatContextValue {
  chat: ChatMessage[]
  chats: Chat[]
  loading: boolean
  streamingContent: string | null
  error: ChatStreamError | null
  loadInitialChats: () => Promise<void>
  threadId: string | null
  setThreadId: (v: string | null) => void
  setChat: (v: ChatMessage[]) => void
  scrollDown: () => void
  scrollUp: () => void
  loadChatByThreadId: (threadId: string) => Promise<void>
  handleNewInput: (input: string) => Promise<void>
  handleRegenerate: () => Promise<void>
  retryLast: () => Promise<void>
  dismissError: () => void
  stopStream: () => void
  onThreadScroll: () => void
  feedback: Feedback | null
  scrollingThreadRef: RefObject<HTMLDivElement | null>
}

export const ChatContext = createContext<ChatContextValue>({
  chat: [],
  chats: [],
  loading: false,
  streamingContent: null,
  error: null,
  loadInitialChats: noopAsync,
  threadId: null,
  setThreadId: noop,
  setChat: noop,
  scrollDown: noop,
  scrollUp: noop,
  loadChatByThreadId: noopAsync,
  handleNewInput: noopAsync,
  handleRegenerate: noopAsync,
  retryLast: noopAsync,
  dismissError: noop,
  stopStream: noop,
  onThreadScroll: noop,
  feedback: null,
  scrollingThreadRef: { current: null },
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
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [error, setError] = useState<ChatStreamError | null>(null)
  const [threadId, setThreadId] = useState<string | null>('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const scrollingThreadRef = useRef<HTMLDivElement | null>(null)
  const lastParamsRef = useRef<StreamChatParams | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  // Whether the thread is pinned to the bottom. Starts true and flips off when
  // the user scrolls up so live token streaming doesn't yank them back down.
  const stickToBottomRef = useRef(true)

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

  // Tracks the user's scroll position; re-pins to bottom only when they're
  // already near the bottom (within 120px).
  const onThreadScroll = () => {
    const el = scrollingThreadRef.current
    if (!el) return
    stickToBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }

  useEffect(() => {
    if (chat?.length && stickToBottomRef.current) scrollDown()
  }, [chat, streamingContent])

  useEffect(
    () => () => {
      abortRef.current?.abort()
    },
    [],
  )

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

  // Consumes the SSE stream: accumulates text deltas into `streamingContent`,
  // commits the final assistant message on `done`, and surfaces `error`.
  // Resolves to `true` if any assistant message was committed (a full `done`
  // or a partial commit on user-stop), `false` if the stream errored with
  // nothing to show — callers use this to roll back optimistic UI.
  const runStream = async (params: StreamChatParams): Promise<boolean> => {
    lastParamsRef.current = params
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    // A fresh send/regenerate should always re-pin to the bottom.
    stickToBottomRef.current = true
    setError(null)
    setLoading(true)
    setStreamingContent('')

    let accumulated = ''
    let committed = false
    try {
      for await (const event of streamChat({
        ...params,
        signal: controller.signal,
      })) {
        if (event.type === 'text') {
          accumulated += event.delta
          setStreamingContent(accumulated)
        } else if (event.type === 'done') {
          committed = true
          if (event.threadId) setThreadId(event.threadId)
          setChat((prev) => [
            ...prev,
            { role: 'assistant', content: event.message.content },
          ])
          setFeedback(null)
        } else if (event.type === 'error') {
          if (event.code !== 'aborted') {
            setError({ message: event.message, retryable: event.retryable })
          }
        }
      }
      if (!committed && accumulated) {
        committed = true
        setChat((prev) => [
          ...prev,
          { role: 'assistant', content: accumulated },
        ])
      }
    } catch {
      setError({
        message: 'Something went wrong. Please try again.',
        retryable: true,
      })
    } finally {
      setStreamingContent(null)
      setLoading(false)
      abortRef.current = null
    }
    return committed
  }

  const handleNewInput = async (input: string) => {
    if (loading) return
    const trimmed = input.trim()
    if (!trimmed) return
    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    trackEvent('campaign_assistant_chatbot_input', { input: trimmed })
    setChat((prev) => [...prev, userMessage])

    // Structured so TS narrows `threadId` to a non-null string on the
    // follow-up branch (no cast needed).
    await runStream(
      threadId && chat.length > 0
        ? { message: trimmed, threadId }
        : { message: trimmed, initial: true },
    )
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
    setError(null)
    setThreadId(threadId)
  }

  const handleRegenerate = async () => {
    if (!threadId || loading) return
    // Optimistically drop the last reply, but snapshot the thread so we can
    // restore it if the regenerate stream fails with nothing committed —
    // otherwise the message would be lost from the UI until a reload.
    const previousChat = chat
    setChat((prev) => prev.slice(0, -1))
    const committed = await runStream({ threadId, regenerate: true })
    if (!committed) setChat(previousChat)
  }

  const retryLast = async () => {
    if (loading) return
    const params = lastParamsRef.current
    if (!params) return
    await runStream(params)
  }

  // Aborts the in-flight stream; the generator emits an `aborted` event which
  // `runStream` ignores, and the partial text is committed on stream close.
  const stopStream = () => abortRef.current?.abort()

  const dismissError = () => setError(null)

  return (
    <ChatContext.Provider
      value={{
        chat,
        chats,
        loading,
        streamingContent,
        error,
        feedback,
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
        retryLast,
        dismissError,
        stopStream,
        onThreadScroll,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
