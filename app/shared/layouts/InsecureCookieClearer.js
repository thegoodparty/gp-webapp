'use client'
import { useEffect } from 'react'

const getInsecureTokenCookie = () => {
  const cookies = document.cookie.split(';')
  return cookies.find((cookie) => cookie.trim().startsWith('token='))
}

const deleteInsecureTokenCookie = () => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  window.location.reload()
}

export const InsecureCookieClearer = ({ children }) => {
  useEffect(() => {
    const insecureTokenCookie = getInsecureTokenCookie()

    if (insecureTokenCookie) {
      deleteInsecureTokenCookie()
    }
  }, [])
  return <>{children}</>
}
