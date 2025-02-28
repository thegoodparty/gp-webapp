import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export const generateAIContent = async (key, chat, inputValues = {}) => {
  console.log('Key: ', key);
  //console.log('regenerate: ', regenerate);
  console.log('chat: ', chat);
  //console.log('editMode: ', editMode);
  console.log('inputValues: ', inputValues);
  try {
    const resp = await clientFetch(apiRoutes.campaign.ai.create, {
      key,
      chat,
      inputValues,
    });
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};
