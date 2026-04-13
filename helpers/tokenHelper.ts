import { auth } from '@clerk/nextjs/server'
import { decodeJwt } from 'jose'

export async function getServerToken(): Promise<string | undefined> {
  try {
    const session = await auth()
    const token = (await session.getToken()) ?? undefined
    return token
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
