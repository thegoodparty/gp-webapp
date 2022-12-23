'use client';
import dynamic from 'next/dynamic';

import { getUserCookie } from 'helpers/cookieHelper';
const AdminInvalidateCache = dynamic(() => import('./AdminInvalidateCache'));

export default function AdminClientLoad() {
  const user = getUserCookie(true);

  if (!user || !user.isAdmin) {
    return null;
  }

  return <>{user && user.isAdmin ? <AdminInvalidateCache /> : null}</>;
}
