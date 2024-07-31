import { deleteUserCookies } from 'helpers/cookieHelper';
import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';

export const handleLogOut = async (e) => {
  deleteUserCookies();
  fireGTMButtonClickEvent(e.currentTarget);
  await gpFetch(gpApi.user.logout, false, false, false, false, true);
  window.location.replace('/');
};
