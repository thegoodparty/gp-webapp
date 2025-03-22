import { buildUrl } from '@shared/utils/buildUrl';

export const unAuthFetch = async (url, data, revalidate = 3600) => {
  const parsedUrl = buildUrl(
    {
      path: url,
      method: 'GET',
    },
    data,
  );
  const resp = await fetch(parsedUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate },
  });

  return await resp.json();
};
