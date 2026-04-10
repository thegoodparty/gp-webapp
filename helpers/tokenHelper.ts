import { auth } from '@clerk/nextjs/server'
import { decodeJwt } from 'jose'

export async function getServerToken(): Promise<string | undefined> {
  try {
    const { getToken, userId } = await auth()
    const token = (await getToken()) ?? undefined
    console.log('[getServerToken] userId:', userId, 'hasToken:', !!token)
    return token
  } catch (e) {
    console.error('[getServerToken] error:', e)
    return undefined
  }
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = decodeJwt(token)
    return typeof exp === 'number' && exp * 1000 < Date.now()
  } catch {
    return true
  }
}
