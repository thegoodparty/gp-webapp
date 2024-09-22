import { useContext } from 'react';
import { ChatContext } from './CampaignManagerPage';
import ChatMessage from './ChatMessage';

export default function Chat() {
  const { chat } = useContext(ChatContext);
  return (
    <div>
      {(chat || []).map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  );
}
