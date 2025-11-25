'use client'
import { useEffect } from 'react'

const getInsecureTokenCookie = (): string | undefined => {
  const cookies = document.cookie.split(';')
  return cookies.find((cookie) => cookie.trim().startsWith('token='))
}

const deleteInsecureTokenCookie = (): void => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  window.location.reload()
}

interface InsecureCookieCleanerProps {
  children: React.ReactNode
}

export const InsecureCookieClearer = ({ children }: InsecureCookieCleanerProps): React.JSX.Element => {
  useEffect(() => {
    const insecureTokenCookie = getInsecureTokenCookie()

    if (insecureTokenCookie) {
      deleteInsecureTokenCookie()
    }
  }, [])
  return <>{children}</>
}

