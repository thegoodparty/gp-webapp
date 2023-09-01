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

  useEffect(() => {
    const user = getUserCookie();
    if (user) {
      loadNotifications();
    }
  }, []);

  const loadNotifications = async () => {
    const res = await fetchNotifications();
    setNotifications(res.notifications);
  };

  return notifications;
}
