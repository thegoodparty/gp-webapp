import { useEffect } from 'react';
import ChatMessage from './ChatMessage';
import EmptyChat from './EmptyChat';
import LoadingChatAnimation from './LoadingChatAnimation';
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat';

export default function Chat() {
  const { chat, shouldType, setShouldType, loading, scrollDown } = useChat();

  useEffect(() => {
    // When new messages are added, scroll to the bottom
    if (shouldType) {
      scrollDown();
    }
  }, [shouldType, loading]);

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
              scrollCallback={scrollDown}
              isLastMessage={index === chat.length - 1}
            />
          ))}
        </>
      ) : (
        <EmptyChat />
      )}
      <LoadingChatAnimation />
      {/* This empty div is used as a reference to scroll to */}
      {/*<div ref={lastMessageRef}></div>*/}
    </div>
  );
}
