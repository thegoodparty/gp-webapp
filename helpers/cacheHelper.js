import gpFetch from 'gpApi/gpFetch';
import { candidateRoute } from './candidateHelper';
const appBase = process.env.NEXT_PUBLIC_APP_BASE || 'https://dev.goodparty.org';

export const revalidatePage = async (path) => {
  const api = {
    url: `${appBase}/api/revalidate`,
    method: 'GET',
  };
  const payload = {
    path,
  };
  return await gpFetch(api, payload);
};

export const revalidateCandidate = async (candidate) => {
  const path = candidateRoute(candidate);
  return await revalidatePage(path);
};
