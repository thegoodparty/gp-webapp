const TOKEN_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
};

export const setTokenCookie = (resp, token) => {
  resp.cookies.set('token', token, TOKEN_CONFIG);
  return resp;
};

export const deleteTokenCookie = (resp) => {
  resp.cookies.set('token', '', {
    ...TOKEN_CONFIG,
    expires: new Date(0),
  });
  return resp;
};
