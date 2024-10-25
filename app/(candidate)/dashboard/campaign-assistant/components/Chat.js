'use client';
import { useEffect } from 'react';
import ChatMessage from './ChatMessage';
import EmptyChat from './EmptyChat';
import LoadingChatAnimation from './LoadingChatAnimation';
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat';
import { Fab } from '@mui/material';
import { MdKeyboardArrowUp } from 'react-icons/md';

export default function Chat() {
  const { chat, shouldType, loadInitialChats, scrollingThreadRef, scrollUp } =
    useChat();

  useEffect(() => {
    const initialLoad = async () => {
      await loadInitialChats();
    };
    initialLoad();
  }, []);

  return (
    <div
      ref={scrollingThreadRef}
      className="flex-grow overflow-auto md:flex-1 md:pr-6 relative"
    >
      <div className="min-h-full">
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
        <div className="fixed bottom-28">
          <Fab onClick={scrollUp} size="small" color="primary">
            <MdKeyboardArrowUp />
          </Fab>
        </div>
      </div>
    </div>
  );
}
