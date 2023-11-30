import { getCookie, setCookie } from '/helpers/cookieHelper';

async function gpFetch(endpoint, data, revalidate, token, isFormData = false) {
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

  return await fetchCall(url, requestOptions, revalidate);
}

export default gpFetch;

function headersOptions(body, method = 'GET', token) {
  const headers = {
    // 'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
  };

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

async function fetchCall(url, options = {}, revalidate) {
  if (options.method === 'GET') {
    delete options.body;
  }
  let res;
  if (revalidate) {
    res = await fetch(url, { ...options, next: { revalidate } });
  } else {
    res = await fetch(url, { ...options, cache: 'no-store' });
  }
  try {
    let jsonRes = res.json();
    return jsonRes;
  } catch (e) {
    return false;
  }
}
