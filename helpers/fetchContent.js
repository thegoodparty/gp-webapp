import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function fetchContent(key) {
  const api = gpApi.content.contentByKey;
  const payload = {
    key,
  };
  return await gpFetch(api, payload, 3600);
}
