import { useState, useEffect } from 'react';
import {
  fetchChatHistory,
  getChatThread,
  regenerateChatThread,
} from './ajaxActions';

const useChat = () => {
  const [chat, setChat] = useState(null);
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
    setThreadId(threadId);
  };

  const loadChatByThreadId = async (threadId) => {
    const currentChat = await getChatThread({ threadId });
    setChat(currentChat?.chat || []);
    setThreadId(threadId);
  };

  const regenerateChat = async () => {
    const currentChat = await regenerateChatThread(threadId);
    setChat(currentChat?.chat || []);
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
  };
};

export default useChat;
