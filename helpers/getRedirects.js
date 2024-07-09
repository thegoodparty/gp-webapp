import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

let dbRedirects;
let dbFetchTime;

const fetchRedirects = async () => {
  try {
    const api = gpApi.content.contentByKey;
    const payload = {
      key: 'redirects',
    };
    return await gpFetch(api, payload, 3600);
  } catch (e) {
    console.log('fetchRedirects error', e);
    return { content: {} };
  }
};

export const getRedirects = async () => {
  console.log('getRedirects');
  if (!dbRedirects) {
    console.log('getRedirects2');
    // only call dbRedirect if it is not defined or once an hour
    if (!dbFetchTime || Date.now() - dbFetchTime > 10 * 3600000) {
      dbFetchTime = Date.now();
      console.log('getRedirects3');
      const res = await fetchRedirects();
      console.log('getRedirects4', res);
      dbRedirects = res.content;
    }
  }
  console.log('getRedirects5', dbRedirects);
  return dbRedirects;
};
