import { getCookie } from 'helpers/cookieHelper';
import { compile, parse } from 'path-to-regexp';

const IS_LOCAL_ENVIRONMENT =
  Boolean(
    typeof process !== 'undefined' &&
      process?.env?.NEXT_PUBLIC_APP_BASE?.includes('localhost'),
  ) ||
  Boolean(
    typeof window !== 'undefined' && window.location.href.includes('localhost'),
  );

/**
 * helper function to interpolate route params into url
 *
 * */
function handleRouteParams(urlString, data) {
  const url = new URL(urlString);
  const { tokens } = parse(url.pathname);
  const hasRouteParams = tokens.some((token) => typeof token !== 'string');

  if (!hasRouteParams || !data) return urlString;

  // Find tokens that are parameters (objects with name property)
  const compiledData = {};
  tokens.forEach((token) => {
    if (typeof token === 'object' && token.name) {
      const paramName = token.name;
      if (paramName in data) {
        // Coerce value to string and store for compilation
        compiledData[paramName] = String(data[paramName]);
        // Remove used parameter from original data object
        delete data[paramName];
      }
    }
  });

  // Compile the URL with the coerced values
  url.pathname = compile(url.pathname)(compiledData);

  return url.toString();
}

async function gpFetch(
  endpoint,
  data,
  revalidate,
  token, // should only be used for server-side calls
  isFormData = false,
  nonJSON = false,
) {
  let { url, method, withAuth, returnFullResponse, additionalRequestOptions } =
    endpoint;

  url = handleRouteParams(url, data);

  if ((method === 'GET' || method === 'DELETE') && data) {
    url = `${url}?`;
    for (const key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        url += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
      }
    }
    url = url.slice(0, -1);
  }

  let body = data;
  if (
    (method === 'POST' || method === 'PUT' || method === 'DELETE') &&
    data &&
    !isFormData
  ) {
    body = JSON.stringify(data);
  }

  let autoToken;
  if (withAuth) {
    autoToken = getCookie('impersonateToken') || token;
  }

  const requestOptions = headersOptions(
    body,
    endpoint.method,
    autoToken,
    isFormData,
  );

  return await fetchCall(
    url,
    { ...requestOptions, ...additionalRequestOptions },
    revalidate,
    nonJSON,
    returnFullResponse,
  );
}

export default gpFetch;

function headersOptions(body, method = 'GET', token, isFormData = false) {
  const headers = {};

  if (!isFormData) {
    headers['content-type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    headers,
    method,
    credentials: 'include',
    mode: 'cors',
    body,
  };
}

async function fetchCall(
  url,
  options = {},
  revalidate,
  nonJSON,
  returnFullResponse = false,
) {
  if (options.method === 'GET') {
    delete options.body;
  }
  let res;
  if (revalidate && !IS_LOCAL_ENVIRONMENT) {
    res = await fetch(url, { ...options, next: { revalidate } });
  } else {
    res = await fetch(url, { ...options, cache: 'no-store' });
  }
  if (nonJSON || returnFullResponse) {
    return res;
  }
  try {
    // TODO: We should consider returning the response as is and handle the error at the caller level.
    //  There's no way for the caller to determine how to react to error response states w/ this current pattern.
    const isSuccessfulResponseStatus = res.status >= 200 && res.status <= 299;
    const isJsonResponse =
      res.headers.get('Content-Type')?.includes('application/json') ?? false;

    return isSuccessfulResponseStatus && isJsonResponse
      ? await res.json()
      : res;
  } catch (e) {
    console.error('error in fetchCall catch', e);
    return false;
  }
}
