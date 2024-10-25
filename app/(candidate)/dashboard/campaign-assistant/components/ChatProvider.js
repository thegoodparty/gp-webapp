'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { createContext, useEffect, useRef, useState } from 'react';
import {
  createInitialChat,
  fetchChatHistory,
  getChatThread,
  regenerateChatThread,
} from 'app/(candidate)/dashboard/campaign-assistant/components/ajaxActions';
import { trackEvent } from 'helpers/fullStoryHelper';

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

export const ChatContext = createContext({
  chat: [],
  chats: [],
  loading: false,
  shouldType: false,
  loadInitialChats: async () => {},
  setShouldType: (v) => {},
  threadId: null,
  setThreadId: (v) => {},
  setChat: (v) => {},
  scrollDown: () => {},
  loadChatByThreadId: async (threadId) => {},
  handleNewInput: async (input) => {},
  handleRegenerate: async () => {},
  feedback: null,
});

export const ChatProvider = ({ children }) => {
  const [chat, setChat] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shouldType, setShouldType] = useState(false);
  const [threadId, setThreadId] = useState('');
  const [feedback, setFeedback] = useState(null);
  const scrollingThreadRef = useRef(null);

  const scrollDown = () =>
    scrollingThreadRef.current &&
    scrollingThreadRef.current.scrollTo({
      behavior: 'smooth',
      top: scrollingThreadRef.current.scrollHeight + 16,
    });

  const scrollUp = () =>
    scrollingThreadRef.current &&
    scrollingThreadRef.current.scrollTo({
      behavior: 'smooth',
      top: 0,
    });

  const finishTyping = () => {
    setShouldType(false);
  };

  useEffect(() => {
    chat?.length && scrollDown();
  }, [chat, shouldType]);

  const loadInitialChats = async () => {
    const { chats: fetchedChats } = await fetchChatHistory();
    let currentChat;
    let threadId;
    if (fetchedChats && fetchedChats.length > 0) {
      // Get the last chat
      threadId = fetchedChats[0].threadId;
      currentChat = await getChatThread({ threadId });
    }
    setChats(fetchedChats || []);
    setChat(currentChat?.chat || []);
    setFeedback(currentChat?.feedback);
    setThreadId(threadId);
  };

  const handleNewInput = async (input) => {
    const userMessage = { role: 'user', content: input };
    const updatedChat = [...chat, userMessage];
    trackEvent('campaign_assistant_chatbot_input', { input });
    setChat(updatedChat);
    setLoading(true);
    if (!threadId || chat.length === 0) {
      const { threadId: newThreadId, chat: newChat } = await createInitialChat(
        input,
      );
      setThreadId(newThreadId);
      setChat(newChat);
    } else {
      const { message } = await updateChat(threadId, input);
      setChat([...updatedChat, message]);
    }
    setLoading(false);
    setShouldType(true);
  };

  const loadChatByThreadId = async (threadId) => {
    const currentChat = await getChatThread({ threadId });
    setChat(currentChat?.chat || []);
    setFeedback(currentChat?.feedback);
    setThreadId(threadId);
  };

  const regenerateChat = async () => {
    const { message } = await regenerateChatThread(threadId);
    const updatedChat = chat.slice(0, -1);
    updatedChat.push(message);
    setChat(updatedChat);
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setChat(chat.slice(0, -1));
    await regenerateChat();
    setShouldType(true);
    setLoading(false);
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        chats,
        loading,
        feedback,
        shouldType,
        threadId,
        setThreadId,
        setChat,
        scrollingThreadRef,
        scrollDown,
        scrollUp,
        loadInitialChats,
        loadChatByThreadId,
        handleNewInput,
        handleRegenerate,
        finishTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
