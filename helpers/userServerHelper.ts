import { cookies } from 'next/headers'
import { User } from './types'

const determineImpersonateCookieOrNot = async (
  cookieName: string,
  impersonateCookieName: string,
): Promise<string | false> => {
  const nextCookies = await cookies()
  const cookie = nextCookies.get(cookieName)
  const impersonateCookie = nextCookies.get(impersonateCookieName)
  if (impersonateCookie?.value) {
    return decodeURIComponent(impersonateCookie.value)
  }
  if (cookie?.value) {
    return decodeURIComponent(cookie.value)
  }
  return false
}

export const getServerToken = async (): Promise<string | false> =>
  await determineImpersonateCookieOrNot('token', 'impersonateToken')

export const getServerUser = async (): Promise<User | null> => {
  const userJSON = await determineImpersonateCookieOrNot(
    'user',
    'impersonateUser',
  )
  return new Promise((resolve) => {
    try {
      if (userJSON && typeof userJSON === 'object') {
        resolve(userJSON as User)
        return
      }
      resolve(userJSON ? (JSON.parse(userJSON) as User) : null)
    } catch (e) {
      console.log('Error in getServerUser', e)
      resolve(null)
    }
  })
}
