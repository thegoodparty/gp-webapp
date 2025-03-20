import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export const generateAIContent = async (key, chat, inputValues = {}) => {
  try {
    const resp = await clientFetch(apiRoutes.campaign.ai.create, {
      key,
      chat,
      inputValues,
    });
    return resp.data;
  } catch (e) {
    console.error('error', e);
    return false;
  }
};
