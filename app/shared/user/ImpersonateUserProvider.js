'use client';
import { createContext, useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getCookie, deleteCookie, setCookie } from 'helpers/cookieHelper';

export const ImpersonateUserContext = createContext({
  user: null,
  token: null,
  impersonate: () => {},
  clear: () => {},
});

export const ImpersonateUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = getCookie('impersonateToken');
    const impersonateUserCookie = getCookie('impersonateUser');
    const user = impersonateUserCookie && JSON.parse(impersonateUserCookie);
    if (token && user) {
      setToken(token);
      setUser(user);
    }
  }, []);

  const clear = () => {
    setToken(null);
    setUser(null);
    deleteCookie('impersonateToken');
    deleteCookie('impersonateUser');
  };

  const set = (token, user) => {
    if (!token || !user) {
      console.error('Invalid token or user');
      return;
    }
    setToken(token);
    setUser(user);
    setCookie('impersonateToken', token);
    setCookie('impersonateUser', JSON.stringify(user));
  };

  const impersonate = async (email) => {
    try {
      const resp = await gpFetch(gpApi.admin.impersonateUser, {
        email,
      });
      const token = resp?.token;
      const user = resp?.user;
      if (token && user) {
        set(token, user);
        return true;
      }
    } catch (e) {
      console.log('error', e);
    }
    return false;
  };

  return (
    <ImpersonateUserContext.Provider
      value={{ user, token, impersonate, clear }}
    >
      {children}
    </ImpersonateUserContext.Provider>
  );
};
