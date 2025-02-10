import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export async function fetchContentByType(type, cacheTime = 3600) {
  const resp = await serverFetch(
    apiRoutes.content.getByType,
    {
      type,
    },
    {
      revalidate: cacheTime,
    },
  );

  return resp.data;
}
