'use client';
import { createContext, useEffect, useState } from 'react';
import DashboardLayout from '../../shared/DashboardLayout';
import ChatHistory from './ChatHistory';
import Chat from './Chat';
import ChatInput from './ChatInput';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import Button from '@shared/buttons/Button';
import CreateNewChat from './CreateNewChat';

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
  const { threadId } = props;
  console.log('props.chat', props.chat);
  const [chat, setChat] = useState(props.chat);
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
    loading,
    shouldType,
    setShouldType,
  };

  console.log('props', props);

  return (
    <DashboardLayout {...props} showAlert={false}>
      <ChatContext.Provider value={contextProps}>
        <div className="p-4 max-w-[900px] mx-auto h-full pb-16 overflow-auto">
          <div className="flex justify-between">
            <CreateNewChat />
            <ChatHistory />
          </div>

          <Chat />
          <ChatInput />
        </div>
      </ChatContext.Provider>
    </DashboardLayout>
  );
}
