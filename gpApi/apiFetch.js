import { API_ROOT } from 'appEnv';

export const unAuthFetch = async (url, revalidate = 3600) => {
  const resp = await fetch(`${API_ROOT}/v1${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate },
  });

  const data = await resp.json();

  return data;
};
