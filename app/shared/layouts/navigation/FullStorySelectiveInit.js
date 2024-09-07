'use client';

import { useEffect } from 'react';

const USER_RATIO = 1; // asign all users to FullStory
const GUEST_RATIO = 0.1; // asign 10% of guests to FullStory

export default function FullStorySelectiveInit({ user }) {
  useEffect(() => {
    if (user) {
      fullstoryIdentity(user);
      selectiveFullStoryTracking(user);
    }
  }, [user]);

  const fullstoryIdentity = (userI) => {
    if (typeof FS === 'undefined') {
      return;
    }
    const impersonateUser = getCookie('impersonateUser');
    if (impersonateUser) {
      FS.shutdown();
      return;
    }
    if (userI && userI.email) {
      const domain = userI.email.split('@')[1];
      if (domain === 'goodparty.org' || userI.isAdmin) {
        FS.shutdown();
      } else {
        FS.identify(userI.id, {
          displayName: `${userI.firstName} ${userI.lastName}`,
          email: userI.email,
        });
      }
    }
  };

  const selectiveFullStoryTracking = (user) => {
    if (typeof FS === 'undefined') {
      return;
    }
    const random = Math.random();
    if (!user) {
      if (random > GUEST_RATIO) {
        FS.shutdown();
      }
    } else {
      if (random > USER_RATIO) {
        FS.shutdown();
      }
    }
  };
  return null;
}
