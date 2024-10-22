import Button from '@shared/buttons/Button';
import { useContext } from 'react';
import { FiPlus } from 'react-icons/fi';
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat';

export default function CreateNewChat() {
  const { setThreadId, setChat } = useChat();
  const handleCreate = () => {
    setChat([]);
    setThreadId(null);
  };

  return (
    <Button
      variant="primary"
      onClick={handleCreate}
      className="w-full md:w-auto"
    >
      <span className="flex items-center">
        <FiPlus />
        <span className="ml-2">New Chat</span>
      </span>
    </Button>
  );
}
