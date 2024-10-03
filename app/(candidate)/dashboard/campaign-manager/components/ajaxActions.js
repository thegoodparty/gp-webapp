import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function fetchChatHistory() {
  try {
    const api = gpApi.campaign.chat.list;
    return await gpFetch(api);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function createInitialChat() {
  try {
    const api = gpApi.campaign.chat.create;
    const payload = { message: ' ' };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function getChatThread({ threadId }) {
  try {
    const api = gpApi.campaign.chat.get;
    const payload = { threadId };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}