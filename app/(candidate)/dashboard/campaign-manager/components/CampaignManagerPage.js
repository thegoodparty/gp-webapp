'use client';
import { createContext } from 'react';
import DashboardLayout from '../../shared/DashboardLayout';
import ChatHistory from './ChatHistory';
import Chat from './Chat';
import ChatInput from './ChatInput';

export const ChatContext = createContext([[], (v) => {}]);

export default function CampaignManagerPage(props) {
  const handleNewInput = (input) => {
    console.log('new input', input);
  };

  const contextProps = {
    handleNewInput,
    ...props,
  };

  console.log('props', props);

  return (
    <DashboardLayout {...props} showAlert={false}>
      <ChatContext.Provider value={contextProps}>
        <div className="p-4 max-w-[900px] mx-auto h-full pb-16 overflow-auto">
          <ChatHistory />
          <Chat />
          <ChatInput />
        </div>
      </ChatContext.Provider>
    </DashboardLayout>
  );
}
