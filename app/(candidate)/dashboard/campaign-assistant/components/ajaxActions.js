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

export async function createInitialChat(message) {
  try {
    const api = gpApi.campaign.chat.create;
    const payload = { message };
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

export async function regenerateChatThread(threadId) {
  try {
    const api = gpApi.campaign.chat.update;
    const payload = { threadId, regenerate: true };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function deleteThread(threadId) {
  try {
    const api = gpApi.campaign.chat.delete;
    const payload = { threadId };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function chatFeedback(threadId, type, message) {
  try {
    const api = gpApi.campaign.chat.feedback;
    const payload = { threadId, message, type };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
