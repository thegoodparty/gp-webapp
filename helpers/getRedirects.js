import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

let dbRedirects;
let dbFetchTime;

const fetchRedirects = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'redirects',
  };
  return await gpFetch(api, payload, 3600);
};

export const getRedirects = async () => {
  if (!dbRedirects) {
    // only call dbRedirect if it is not defined or once an hour
    if (!dbFetchTime || Date.now() - dbFetchTime > 3600000) {
      dbFetchTime = Date.now();
      const res = await fetchRedirects();
      dbRedirects = res.content;
    }
  }
  return dbRedirects;
};
