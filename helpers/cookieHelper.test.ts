import { isImpersonating } from './cookieHelper'

const clearCookies = () => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/')
  })
}

describe('isImpersonating', () => {
  beforeEach(() => {
    clearCookies()
  })

  it('returns false when no impersonateUser cookie is set', () => {
    expect(isImpersonating()).toBe(false)
  })

  it('returns true when impersonateUser cookie exists', () => {
    document.cookie = 'impersonateUser=someValue'
    expect(isImpersonating()).toBe(true)
  })
})
