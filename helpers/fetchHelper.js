import { unAuthFetch } from 'gpApi/unAuthFetch';
import { apiRoutes } from 'gpApi/routes';

export async function fetchContentByType(type) {
  return await unAuthFetch(`${apiRoutes.content.byType.path}/${type}`);
}
