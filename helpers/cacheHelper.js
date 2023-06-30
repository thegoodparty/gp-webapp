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
  const path = '/candidate/[slug]';
  await revalidatePage(path);
  const editPath = '/candidate/[slug]/edit';
  return await revalidatePage(editPath);
};
