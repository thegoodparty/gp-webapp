import { appBase } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { candidateRoute } from './candidateHelper';

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

export const revalidateCandidates = async () => {
  const path = candidateRoute('candidate/[slug]');
  return await revalidatePage(path);
};
