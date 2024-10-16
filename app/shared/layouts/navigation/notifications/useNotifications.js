import { useUser } from '@shared/hooks/useUser';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getUserCookie } from 'helpers/cookieHelper';
import { useState, useEffect } from 'react';

export async function fetchNotifications() {
  try {
    const api = gpApi.notification.list;
    return await gpFetch(api);
  } catch (e) {
    console.log('error at fetchNotifications', e);
    return {};
  }
}

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [user] = useUser();

  const loadNotifications = async () => {
    const res = await fetchNotifications();
    setNotifications(res.notifications);
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // TODO: The interface here should be like useState w/ the setter, setNotifications, exposed as well
  //  so that actions in the UI and update the notifications state, especially now that we have the "dot"
  //  in multiple places
  return notifications;
}
