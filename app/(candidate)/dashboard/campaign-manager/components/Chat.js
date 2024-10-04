import { useContext, useEffect, useRef } from 'react';
import { ChatContext } from './CampaignManagerPage';
import ChatMessage from './ChatMessage';
import EmptyChat from './EmptyChat';
import LoadingDotsAnimation from '@shared/animations/LoadingDotsAnimation';

export default function Chat() {
  const { chat, shouldType, setShouldType, loading, lastMessageRef } =
    useContext(ChatContext);

  useEffect(() => {
    // When new messages are added, scroll to the bottom
    if (shouldType) {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [shouldType, loading]);

  const scrollCallback = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
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
            />
          ))}
        </>
      ) : (
        <EmptyChat />
      )}
      {loading && (
        <div className="w-20 relative ml-6 mb-12">
          <LoadingDotsAnimation />
        </div>
      )}
      {/* This empty div is used as a reference to scroll to */}
      <div ref={lastMessageRef}></div>
    </div>
  );
}
