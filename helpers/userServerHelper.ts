import { cache } from 'react'
import { auth } from '@clerk/nextjs/server'
import { decodeJwt } from 'jose'
import { User } from './types'
import { API_ROOT, API_VERSION_PREFIX } from 'appEnv'

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

export const getServerUser = cache(async (): Promise<User | null> => {
  const token = await getServerToken()
  if (!token) return null

  try {
    const res = await fetch(`${API_ROOT}${API_VERSION_PREFIX}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as User
  } catch {
    return null
  }
})
