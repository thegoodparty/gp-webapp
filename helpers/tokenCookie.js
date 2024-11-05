const TOKEN_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
};

export const setTokenCookie = (resp, token) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + 120 * 24 * 60 * 60 * 1000);
  resp.cookies.set('token', token, {
    ...TOKEN_CONFIG,
    expires,
  });
  return resp;
};

export const deleteTokenCookie = (resp) => {
  resp.cookies.set('token', '', {
    ...TOKEN_CONFIG,
    expires: new Date(0),
  });
  resp.cookies.set('impersonateToken', '', {
    ...TOKEN_CONFIG,
    expires: new Date(0),
  });
  return resp;
};
