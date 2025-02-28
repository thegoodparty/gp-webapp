import { unAuthFetch } from 'gpApi/apiFetch';
import { apiRoutes } from 'gpApi/routes';

export async function fetchContentByType(type) {
  return await unAuthFetch(`${apiRoutes.content.byType.path}/${type}`);
}
