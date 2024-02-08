'use client';
import { getUserCookie } from 'helpers/cookieHelper';
import Script from 'next/script';
import { useEffect } from 'react';

export default function UserSnapScript() {
  useEffect(() => {
    window.onUsersnapLoad = function (api) {
      const user = getUserCookie(true);
      api.init({
        custom: {
          userEmail: user?.email || 'visitor',
          userName: user?.name || 'visitor',
        },
      });
    };
  }, []);
  return (
    <Script
      strategy="afterInteractive"
      type="text/javascript"
      id="usersnap"
      dangerouslySetInnerHTML={{
        __html: `
    // usersnap.com
    
    var script = document.createElement('script');
    script.defer = 1;
    script.src = 'https://widget.usersnap.com/global/load/ffda1fce-d2f7-4471-b118-050ae883436b?onload=onUsersnapLoad';
    document.getElementsByTagName('head')[0].appendChild(script);
    `,
      }}
    />
  );
}
