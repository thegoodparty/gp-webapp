'use client';
import { createContext, useEffect, useState } from 'react';
import DashboardLayout from '../../shared/DashboardLayout';
import ChatHistory from './ChatHistory';
import Chat from './Chat';
import ChatInput from './ChatInput';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import CreateNewChat from './CreateNewChat';
import {
  createInitialChat,
  fetchChatHistory,
  getChatThread,
} from './ajaxActions';
import useChat from './useChat';

export async function updateChat(threadId, input) {
  try {
    const api = gpApi.campaign.chat.update;
    const payload = {
      threadId,
      message: input,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export const ChatContext = createContext([[], (v) => {}]);

export default function CampaignManagerPage(props) {
  const { chat, setChat, threadId, chats } = useChat();

  const [loading, setLoading] = useState(false);
  const [shouldType, setShouldType] = useState(false);
  const handleNewInput = async (input) => {
    setLoading(true);
    const { message } = await updateChat(threadId, input);

    let updatedChat = [...chat, { role: 'user', content: input }, message];
    setChat(updatedChat);
    setLoading(false);
    setShouldType(true);
  };

  const contextProps = {
    handleNewInput,
    ...props,
    chat,
    chats,
    loading,
    shouldType,
    setShouldType,
  };

  console.log('contextProps', contextProps);

  return (
    <DashboardLayout {...props} showAlert={false}>
      <ChatContext.Provider value={contextProps}>
        <div className="p-4 max-w-[960px] mx-auto h-full pb-16 overflow-auto">
          <div className="md:flex md:flex-row-reverse">
            <div className="md:w-[170px] md:flex md:flex-col md:items-end">
              <CreateNewChat />
              <ChatHistory />
            </div>
            <div className=" md:flex-1 md:pr-6">
              <Chat />
            </div>
          </div>
          <ChatInput />
        </div>
      </ChatContext.Provider>
    </DashboardLayout>
  );
}
