import { useState, useEffect } from 'react';
import {
  fetchChatHistory,
  getChatThread,
  regenerateChatThread,
} from './ajaxActions';

const useChat = () => {
  const [chat, setChat] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [chats, setChats] = useState([]);

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

  const loadChatByThreadId = async (threadId) => {
    const currentChat = await getChatThread({ threadId });
    setChat(currentChat?.chat || []);
    setFeedback(currentChat?.feedback);
    setThreadId(threadId);
  };

  const regenerateChat = async () => {
    const { message } = await regenerateChatThread(threadId);
    console.log('message in regenerateChat', message);
    console.log('regenerate chat before', chat);
    const updatedChat = chat.slice(0, -1);
    updatedChat.push(message);
    console.log('regenerate chat after', updatedChat);
    setChat(updatedChat);
  };

  useEffect(() => {
    loadInitialChats();
  }, []);

  return {
    chat,
    setChat,
    threadId,
    setThreadId,
    chats,
    loadChatByThreadId,
    regenerateChat,
    feedback,
  };
};

export default useChat;
