'use client'
import { useEffect } from 'react'
import ChatMessage from './ChatMessage'
import EmptyChat from './EmptyChat'
import LoadingChatAnimation from './LoadingChatAnimation'
import ChatError from './ChatError'
import useChat from 'app/dashboard/campaign-assistant/components/useChat'

const Chat = (): React.JSX.Element => {
  const {
    chat,
    streamingContent,
    error,
    loadInitialChats,
    scrollingThreadRef,
    onThreadScroll,
  } = useChat()

  useEffect(() => {
    const initialLoad = async () => {
      await loadInitialChats()
    }
    initialLoad()
  }, [])

  const hasStreamingText =
    streamingContent !== null && streamingContent.length > 0

  return (
    <div
      ref={scrollingThreadRef}
      onScroll={onThreadScroll}
      className="flex-grow overflow-auto px-4"
    >
      <div className="w-full h-full mx-auto max-w-[960px]">
        {chat && chat.length > 0 ? (
          <>
            {chat.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                isLastMessage={index === chat.length - 1 && !hasStreamingText}
              />
            ))}
          </>
        ) : (
          !hasStreamingText && <EmptyChat />
        )}
        {hasStreamingText && (
          <ChatMessage
            message={{ role: 'assistant', content: streamingContent }}
            isLastMessage={false}
            isStreaming
          />
        )}
        {!hasStreamingText && <LoadingChatAnimation />}
        {error && <ChatError />}
      </div>
    </div>
  )
}

export default Chat
