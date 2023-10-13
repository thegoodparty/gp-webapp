import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function fetchContentByKey(key, cacheTime = 3600) {
  const api = gpApi.content.contentByKey;
  const payload = {
    key,
  };
  return await gpFetch(api, payload, cacheTime);
}
