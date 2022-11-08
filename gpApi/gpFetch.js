async function gpFetch(endpoint, revalidate) {
  if (endpoint.method === 'GET') {
    if (revalidate) {
      return await fetch(endpoint.url, { next: { revalidate } });
    } else {
      return await fetch(endpoint.url);
    }
  }
}

export default gpFetch;
