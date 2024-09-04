const saveToken = async (token) => {
  return await fetch('/api/set-cookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
};

export default saveToken;
