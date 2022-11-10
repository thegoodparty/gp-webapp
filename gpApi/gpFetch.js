async function gpFetch(endpoint, revalidate) {
  try {
    if (endpoint.method === 'GET') {
      if (revalidate) {
        return await fetch(endpoint.url, { next: { revalidate } });
      } else {
        return await fetch(endpoint.url);
      }
    }
  } catch (e) {
    console.log('error at gpFetch endpoint', endpoint);
    console.log('error at gpFetch', e);
    return { json: () => {} };
  }
}

export default gpFetch;
