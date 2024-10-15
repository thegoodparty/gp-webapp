import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export const generateAIContent = async (
  key,
  regenerate,
  chat,
  editMode,
  inputValues = {},
) => {
  try {
    const api = gpApi.campaign.ai.create;
    return await gpFetch(api, {
      key,
      regenerate,
      chat,
      editMode,
      inputValues,
    });
  } catch (e) {
    console.log('error', e);
    return false;
  }
};
