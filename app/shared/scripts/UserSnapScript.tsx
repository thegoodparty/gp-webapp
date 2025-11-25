'use client'
import { getUserCookie } from 'helpers/cookieHelper'
import { trackEvent } from 'helpers/analyticsHelper'
import Script from 'next/script'
import React, { useEffect } from 'react'

interface UsersnapApi {
  init: (config: {
    custom: {
      userEmail: string
      userName: string
    }
  }) => void
  on: (event: string, callback: () => void) => void
}

declare global {
  interface Window {
    onUsersnapLoad?: (api: UsersnapApi) => void
  }
}

export default function UserSnapScript(): React.JSX.Element {
  useEffect(() => {
    window.onUsersnapLoad = (api: UsersnapApi) => {
      const user = getUserCookie(true)

      api.init({
        custom: {
          userEmail: user && user.email ? user.email : 'visitor',
          userName:
            user && user.firstName
              ? `${user.firstName} ${user.lastName ?? ''}`
              : 'visitor',
        },
      })

      api.on('submit', () => {
        trackEvent('usersnap_submission', {
          isVisitor: !(user && user.email),
        })
      })
    }
  }, [])
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
  )
}
