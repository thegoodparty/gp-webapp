import { cookies } from 'next/headers'

const determineImpersonateCookieOrNot = async (
  cookieName,
  impersonateCookieName,
) => {
  const nextCookies = await cookies()
  const cookie = nextCookies.get(cookieName)
  const impersonateCookie = nextCookies.get(impersonateCookieName)
  if (impersonateCookie?.value) {
    return decodeURIComponent(impersonateCookie.value)
  } else if (cookie?.value) {
    return decodeURIComponent(cookie.value)
  }
  return false
}

export const getServerToken = async () =>
  await determineImpersonateCookieOrNot('token', 'impersonateToken')

export const getServerUser = async () => {
  const userJSON = await determineImpersonateCookieOrNot(
    'user',
    'impersonateUser',
  )
  return new Promise((resolve) => {
    try {
      if (userJSON && typeof userJSON === 'object') {
        resolve(userJSON)
      }
      resolve(userJSON ? JSON.parse(userJSON) : null)
    } catch (e) {
      console.log('Error in getServerUser', e)
      resolve(null)
    }
  })
}
