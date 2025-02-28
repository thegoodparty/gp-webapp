import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';
import { fetchContentByType } from 'helpers/fetchHelper';

export const fetchSections = async () => {
  const payload = {
    type: 'blogSections',
  };
  // const resp = await serverFetch(apiRoutes.content.getByType, payload, {
  //   revalidate: 3600,
  // });
  const resp = await fetchContentByType('blogSections');
  return resp.data;
};
