import { deleteUserCookies } from 'helpers/cookieHelper';
import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export const handleLogOut = async (e) => {
  deleteUserCookies();
  e?.currentTarget && fireGTMButtonClickEvent(e?.currentTarget);
  await clientFetch(apiRoutes.authentication.logout);
  window.location.replace('/');
};
