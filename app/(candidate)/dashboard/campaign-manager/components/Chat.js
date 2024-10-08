import { useContext, useEffect, useRef } from 'react';
import { ChatContext } from './CampaignManagerPage';
import ChatMessage from './ChatMessage';
import EmptyChat from './EmptyChat';
import LoadingDotsAnimation from '@shared/animations/LoadingDotsAnimation';
import LoadingChatAnimation from './LoadingChatAnimation';

export default function Chat() {
  const {
    chat,
    shouldType,
    setShouldType,
    loading,
    lastMessageRef,
    scrollDown,
  } = useContext(ChatContext);

  useEffect(() => {
    // When new messages are added, scroll to the bottom
    if (shouldType) {
      scrollDown();
    }
  }, [shouldType, loading]);

  const scrollCallback = () => {
    if (lastMessageRef.current) {
      scrollDown();
    }
  };

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
              scrollCallback={scrollCallback}
              canRegenerate={index === chat.length - 1}
            />
          ))}
        </>
      ) : (
        <EmptyChat />
      )}
      <LoadingChatAnimation />
      {/* This empty div is used as a reference to scroll to */}
      <div ref={lastMessageRef}></div>
    </div>
  );
}
