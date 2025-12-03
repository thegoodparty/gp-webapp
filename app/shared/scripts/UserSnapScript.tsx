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
  logEvent: (eventName: string) => void
}

declare global {
  interface Window {
    onUsersnapLoad?: (api: UsersnapApi) => void
    Usersnap?: {
      api: UsersnapApi
    }
    __usersnapReady?: Promise<UsersnapApi>
    __usersnapResolve?: (api: UsersnapApi) => void
  }
}

export function waitForUsersnap(timeoutMs = 10000): Promise<UsersnapApi> {
  if (window.Usersnap?.api) {
    return Promise.resolve(window.Usersnap.api)
  }
  if (window.__usersnapReady) {
    return window.__usersnapReady
  }
  const loadingPromise = new Promise<UsersnapApi>((resolve) => {
    window.__usersnapResolve = resolve
  })
  const timeoutPromise = new Promise<UsersnapApi>((_, reject) => {
    setTimeout(() => {
      window.__usersnapReady = undefined
      window.__usersnapResolve = undefined
      reject(new Error('Usersnap failed to load within timeout period'))
    }, timeoutMs)
  })
  window.__usersnapReady = Promise.race([loadingPromise, timeoutPromise])
  return window.__usersnapReady
}

export default function UserSnapScript(): React.JSX.Element {
  useEffect(() => {
    window.onUsersnapLoad = (api: UsersnapApi) => {
      const user = getUserCookie(true)

      window.Usersnap = { api }

      if (window.__usersnapResolve) {
        window.__usersnapResolve(api)
        window.__usersnapResolve = undefined
      }

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

    return () => {
      if (window.onUsersnapLoad) {
        window.onUsersnapLoad = undefined
      }
    }
  }, [])
  return (
    <Script
      strategy="afterInteractive"
      type="text/javascript"
      id="usersnap"
      onError={() => {
        if (window.__usersnapResolve) {
          window.__usersnapReady = undefined
          window.__usersnapResolve = undefined
        }
      }}
      dangerouslySetInnerHTML={{
        __html: `
    // usersnap.com
    
    var script = document.createElement('script');
    script.defer = 1;
    script.onerror = function() {
      if (window.__usersnapResolve) {
        window.__usersnapReady = undefined;
        window.__usersnapResolve = undefined;
      }
    };
    script.src = 'https://widget.usersnap.com/global/load/ffda1fce-d2f7-4471-b118-050ae883436b?onload=onUsersnapLoad';
    document.getElementsByTagName('head')[0].appendChild(script);
    `,
      }}
    />
  )
}
