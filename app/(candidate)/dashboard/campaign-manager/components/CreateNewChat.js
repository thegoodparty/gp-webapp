import Button from '@shared/buttons/Button';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { FiPlus } from 'react-icons/fi';

export async function createChat() {
  try {
    const api = gpApi.campaign.chat.create;
    const payload = { message: ' ' };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function CreateNewChat() {
  const handleCreate = async () => {
    console.log('creating new chat');
    await createChat();
    console.log('created');
    window.location.reload();
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
