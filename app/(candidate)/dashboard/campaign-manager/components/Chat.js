import { useContext, useEffect, useRef } from 'react';
import { ChatContext } from './CampaignManagerPage';
import ChatMessage from './ChatMessage';

export default function Chat() {
  const { chat, shouldType, setShouldType } = useContext(ChatContext);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    // When new messages are added, scroll to the bottom
    if (shouldType) {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [shouldType]);

  const scrollCallback = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {(chat || []).map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          type={shouldType && index === chat.length - 1}
          setShouldType={setShouldType}
          scrollCallback={scrollCallback}
        />
      ))}
      {/* This empty div is used as a reference to scroll to */}
      <div ref={lastMessageRef}></div>
    </div>
  );
}
