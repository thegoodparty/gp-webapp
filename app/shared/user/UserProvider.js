'use client';
import { createContext, useEffect, useState } from 'react';
import { getUserCookie } from 'helpers/cookieHelper';

export const UserContext = createContext([null, () => {}]);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cookieUser = getUserCookie(true);
    if (cookieUser && cookieUser?.id) {
      setUser(cookieUser);
    }
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
