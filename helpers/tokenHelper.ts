import { auth } from '@clerk/nextjs/server'
import { decodeJwt } from 'jose'

export async function getServerToken(): Promise<string | undefined> {
  try {
    const { getToken } = await auth()
    return (await getToken()) ?? undefined
  } catch {
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
