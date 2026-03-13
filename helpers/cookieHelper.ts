import { User } from './types'

export const getCookie = (name: string): string | false => {
  if (typeof window === 'undefined') {
    return false
  }
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const part = parts.pop()
    if (part) {
      return decodeURI(part.split(';').shift() ?? '')
    }
  }
  return false
}

export const setCookie = (
  name: string,
  value: string,
  days: number = 120,
): void => {
  if (typeof window === 'undefined') {
    return
  }
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}; SameSite=Strict`
  }
  document.cookie = `${name}=${
    encodeURI(value) || ''
  }${expires}; path=/; SameSite=Lax`
}

export const deleteCookies = (): void => {
  if (typeof window === 'undefined') {
    return
  }
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
  })
}

export const deleteUserCookies = (): void => {
  deleteCookie('user')
  deleteCookie('impersonateUser')
  deleteCookie('signupRedirect')
}

export const deleteCookie = (name: string): void => {
  if (typeof window === 'undefined') {
    return
  }
  setCookie(name, '', 0)
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export const setUserCookie = (value: string | object): void => {
  if (typeof window === 'undefined') {
    return
  }
  const val = typeof value === 'string' ? value : JSON.stringify(value)
  setCookie(getCookie('impersonateUser') ? 'impersonateUser' : 'user', val)
}

export function getUserCookie(withParse: false): string | false
export function getUserCookie(withParse: true): User | false
export function getUserCookie(
  withParse: boolean = false,
): string | User | false {
  if (typeof window === 'undefined') {
    return false
  }

  const impersonateUser = getCookie('impersonateUser')
  if (impersonateUser) {
    if (withParse) {
      return JSON.parse(impersonateUser)
    } else {
      return impersonateUser
    }
  }

  const userCookieName = 'user'

  const user = getCookie(userCookieName)
  if (user && withParse) {
    try {
      return JSON.parse(decodeURIComponent(user))
    } catch (e) {
      console.error('User cookie parse failed')
      deleteCookie(userCookieName)
      return false
    }
  }
  if (user) {
    return decodeURIComponent(user)
  } else {
    return false
  }
}
