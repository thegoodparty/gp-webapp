import Button from '@shared/buttons/Button';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useContext } from 'react';
import { FiPlus } from 'react-icons/fi';
import { ChatContext } from './CampaignAssistantPage';

export default function CreateNewChat() {
  const { setThreadId, setChat } = useContext(ChatContext);
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
