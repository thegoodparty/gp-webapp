'use client'
import { useEffect } from 'react'
import ChatMessage from './ChatMessage'
import EmptyChat from './EmptyChat'
import LoadingChatAnimation from './LoadingChatAnimation'
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat'

export default function Chat() {
  const { chat, shouldType, loadInitialChats, scrollingThreadRef } = useChat()

  useEffect(() => {
    const initialLoad = async () => {
      await loadInitialChats()
    }
    initialLoad()
  }, [])

  return (
    <div ref={scrollingThreadRef} className="flex-grow overflow-auto px-4">
      <div className="w-full h-full mx-auto max-w-[960px]">
        {chat && chat.length > 0 ? (
          <>
            {(chat || []).map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                type={shouldType && index === chat.length - 1}
                isLastMessage={index === chat.length - 1}
              />
            ))}
          </>
        ) : (
          <EmptyChat />
        )}
        <LoadingChatAnimation />
      </div>
    </div>
  )
}
