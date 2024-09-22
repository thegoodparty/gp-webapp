'use client';
import { createContext } from 'react';
import DashboardLayout from '../../shared/DashboardLayout';
import ChatHistory from './ChatHistory';
import Chat from './Chat';
import ChatInput from './ChatInput';

const chat = [
  { role: 'system', content: 'Welcome to the chat!' },
  { role: 'user', content: 'Hi! how are you doing?' },
  {
    role: 'system',
    content: `well well well
    <br/>
    <h3>Select one option:</h3> 
    
    <ol role="list">
    <li>Great</li>
    <li>Good</li>
    <li>Bad</li>
    </ol>`,
  },
];

export const ChatContext = createContext([[], (v) => {}]);

export default function CampaignManagerPage(props) {
  const handleNewInput = (input) => {
    console.log('new input', input);
  };

  const contextProps = {
    chat,
    handleNewInput,
  };

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
