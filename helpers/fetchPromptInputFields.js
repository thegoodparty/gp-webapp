import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function fetchPromptInputFields(subKey) {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'promptInputFields',
  };

  const { content } = await gpFetch(api, payload, 3600);
  return content[subKey];
}
