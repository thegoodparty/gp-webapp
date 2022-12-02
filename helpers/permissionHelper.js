import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

export const adminAccessOnly = () => {
  const user = getServerUser();
  if (!user?.isAdmin) {
    redirect('/login');
  }
};

export const portalAccessOnly = (role) => {
  if (!role) {
    redirect('/login');
  }
};
