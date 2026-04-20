import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCookie,
  setCookie,
  deleteCookie,
  deleteCookies,
} from './cookieHelper'

const clearCookies = () => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/')
  })
}

describe('cookieHelper', () => {
  beforeEach(() => {
    clearCookies()
  })

  it('getCookie returns false when cookie does not exist', () => {
    expect(getCookie('nonexistent')).toBe(false)
  })

  it('getCookie returns value when cookie exists', () => {
    document.cookie = 'testCookie=hello'
    expect(getCookie('testCookie')).toBe('hello')
  })

  it('setCookie sets a cookie that can be retrieved', () => {
    setCookie('myCookie', 'myValue')
    expect(getCookie('myCookie')).toBe('myValue')
  })

  it('deleteCookie removes a cookie', () => {
    setCookie('toDelete', 'value')
    deleteCookie('toDelete')
    expect(getCookie('toDelete')).toBe(false)
  })

  it('deleteCookies clears all cookies', () => {
    setCookie('a', '1')
    setCookie('b', '2')
    deleteCookies()
    expect(getCookie('a')).toBe(false)
    expect(getCookie('b')).toBe(false)
  })
})
