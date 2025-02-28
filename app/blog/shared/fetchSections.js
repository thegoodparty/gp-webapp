import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';
import { fetchContentByType } from 'helpers/fetchHelper';

export const fetchSections = async () => {
  const resp = await fetchContentByType('blogSections');
  return resp.data;
};
