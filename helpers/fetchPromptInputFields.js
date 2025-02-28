import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

export async function fetchPromptInputFields(subKey) {
  const resp = await clientFetch(
    apiRoutes.content.getByType,
    {
      type: 'promptInputFields',
    },
    { revalidate: 3600 },
  );
  const content = resp.data;
  return content[subKey];
}
