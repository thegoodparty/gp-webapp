'use client';
import { hookstate, useHookstate } from '@hookstate/core';
import { getUserCookie } from 'helpers/cookieHelper';
import { useEffect } from 'react';

export const globalUserState = hookstate(false);

export default function UserState() {
  const userState = useHookstate(globalUserState);
  useEffect(() => {
    const user = getUserCookie(true);
    if (user) {
      userState.set(() => user);
    }
  }, []);
  return <></>;
}
