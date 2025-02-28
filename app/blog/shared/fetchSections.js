import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export const fetchSections = async () => {
  const payload = {
    type: 'blogSections',
  };
  const resp = await serverFetch(apiRoutes.content.getByType, payload, {
    revalidate: 3600,
  });
  return resp.data;
};
