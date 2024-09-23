import Button from '@shared/buttons/Button';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

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
    <Button variant="primary" onClick={handleCreate}>
      Start a new chat
    </Button>
  );
}
