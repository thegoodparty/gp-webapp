import { auth } from '@clerk/nextjs/server'
import { decodeJwt } from 'jose'
import { User } from './types'
import { API_ROOT, API_VERSION_PREFIX } from 'appEnv'

export async function getServerToken(): Promise<string | null> {
  try {
    const { getToken } = await auth()
    return await getToken()
  } catch {
    return null
  }
}

export async function getServerUser(): Promise<User | null> {
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
}
