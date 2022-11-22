import { getCookie, setCookie } from '/helpers/cookieHelper';
import { getServerToken } from '/helpers/userHelper';

async function gpFetch(endpoint, data, revalidate, isFormData = false) {
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

  let token;
  if (withAuth) {
    token = getServerToken() || getCookie('token');
    if (!token) {
      throw new Error({ message: 'missing token' });
    }
  }

  const requestOptions = headersOptions(body, endpoint.method, token);

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
    res = await fetch(url, options);
  }
  return res.json();
}
