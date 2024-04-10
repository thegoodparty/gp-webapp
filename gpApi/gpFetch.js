import { getCookie } from '/helpers/cookieHelper';

async function gpFetch(
  endpoint,
  data,
  revalidate,
  token,
  isFormData = false,
  nonJSON = false,
) {
  let { url, method, withAuth } = endpoint;
  if ((method === 'GET' || method === 'DELETE') && data) {
    url = `${url}?`;
    for (const key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        url += `${key}=${data[key]}&`;
      }
    }
    url = url.slice(0, -1);
  }

  let body = data;
  if ((method === 'POST' || method === 'PUT') && data && !isFormData) {
    body = JSON.stringify(data);
  }

  let autoToken;
  if (withAuth) {
    autoToken = getCookie('impersonateToken') || token || getCookie('token');
    if (!autoToken) {
      throw new Error({ message: 'missing token' });
    }
  }

  const requestOptions = headersOptions(body, endpoint.method, autoToken);

  return await fetchCall(url, requestOptions, revalidate, nonJSON);
}

export default gpFetch;

function headersOptions(body, method = 'GET', token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    headers,
    method,
    mode: 'cors',
    body,
  };
}

async function fetchCall(url, options = {}, revalidate, nonJSON) {
  if (options.method === 'GET') {
    delete options.body;
  }
  let res;
  if (revalidate) {
    res = await fetch(url, { ...options, next: { revalidate } });
  } else {
    res = await fetch(url, { ...options, cache: 'no-store' });
  }
  if (nonJSON) {
    return res;
  }
  try {
    // TODO: We should consider returning the response as is and handle the error at the caller level.
    //  There's no way for the caller to determine how to react to error response states w/ this current pattern.
    const isSuccessfulResponseStatus = res.status >= 200 && res.status <= 299
    const jsonRes = isSuccessfulResponseStatus ?
        res.json() : res;
    return jsonRes;
  } catch (e) {
    return false;
  }
}
