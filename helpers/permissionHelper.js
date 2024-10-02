import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

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
