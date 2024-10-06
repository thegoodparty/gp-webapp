import { useState, useEffect } from 'react';
import {
  createInitialChat,
  fetchChatHistory,
  getChatThread,
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

  useEffect(() => {
    loadInitialChats();
  }, []);

  return { chat, setChat, threadId, setThreadId, chats, loadChatByThreadId };
};

export default useChat;
