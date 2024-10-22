'use client';
import { useEffect } from 'react';
import ChatMessage from './ChatMessage';
import EmptyChat from './EmptyChat';
import LoadingChatAnimation from './LoadingChatAnimation';
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat';

export default function Chat() {
  const { chat, shouldType, setShouldType, loadInitialChats } = useChat();

  useEffect(() => {
    const initialLoad = async () => {
      await loadInitialChats();
    };
    initialLoad();
  }, []);

  return (
    <div className="min-h-full">
      {chat && chat.length > 0 ? (
        <>
          {(chat || []).map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              type={shouldType && index === chat.length - 1}
              setShouldType={setShouldType}
              isLastMessage={index === chat.length - 1}
            />
          ))}
        </>
      ) : (
        <EmptyChat />
      )}
      <LoadingChatAnimation />
    </div>
  );
}
