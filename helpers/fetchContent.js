import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export async function fetchContent(type) {
  const payload = {
    type,
  };

  const resp = await serverFetch(apiRoutes.content.getById, payload, {
    revalidate: 3600,
  });
  return resp.data;
}
