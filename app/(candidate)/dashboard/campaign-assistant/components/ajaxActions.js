import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export async function fetchChatHistory() {
  try {
    const resp = await clientFetch(apiRoutes.campaign.chat.list);
    return resp.data;
  } catch (e) {
    console.error('error', e);
    return false;
  }
}

export async function createInitialChat(message) {
  try {
    const payload = { message, initial: true };
    const resp = await clientFetch(apiRoutes.campaign.chat.create, payload);
    return resp.data;
  } catch (e) {
    console.error('error', e);
    return false;
  }
}

export async function getChatThread({ threadId }) {
  try {
    const payload = { threadId };
    const resp = await clientFetch(apiRoutes.campaign.chat.get, payload);
    return resp.data;
  } catch (e) {
    console.error('error', e);
    return false;
  }
}

export async function regenerateChatThread(threadId) {
  try {
    const payload = { threadId, regenerate: true };
    const resp = await clientFetch(apiRoutes.campaign.chat.update, payload);
    return resp.data;
  } catch (e) {
    console.error('error', e);
    return false;
  }
}

export async function deleteThread(threadId) {
  try {
    const payload = { threadId };
    const resp = await clientFetch(apiRoutes.campaign.chat.delete, payload);
    return resp.data;
  } catch (e) {
    console.error('error', e);
    return false;
  }
}

export async function chatFeedback(threadId, type, message) {
  try {
    const payload = { threadId, message, type };
    const resp = await clientFetch(apiRoutes.campaign.chat.feedback, payload);
    return resp.data;
  } catch (e) {
    console.error('error', e);
    return false;
  }
}
