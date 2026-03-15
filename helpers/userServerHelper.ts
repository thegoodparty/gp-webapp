import { cache } from 'react'
import { User } from './types'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'

export { getServerToken, isTokenExpired } from './tokenHelper'

export const getServerUser = cache(async (): Promise<User | null> => {
  try {
    const response = await serverFetch<User>(apiRoutes.user.getUser)
    if (!response.ok) return null
    return response.data
  } catch {
    return null
  }
})
