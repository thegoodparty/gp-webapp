import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { USER_ROLES } from 'helpers/userHelper';

async function checkIsAdmin() {
  try {
    const api = gpApi.admin.isAdmin;

    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchDkCampaign', e);
    return false;
  }
}

export const canCreateCampaigns = async () => {
  const user = getServerUser();
  console.log(`user =>`, user);
  if (user?.role !== USER_ROLES.SALES && !user?.isAdmin) {
    redirect('/login');
  }
};

export const adminAccessOnly = async () => {
  const user = getServerUser();
  if (!user?.isAdmin) {
    redirect('/login');
  }
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    redirect('/logout');
  }
};

export const portalAccessOnly = (role) => {
  if (!role) {
    redirect('/login');
  }
};
