import { setUserCookie } from 'helpers/cookieHelper'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { User, UserRole } from './types'

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]{8,}$/i

export const updateUser = async (
  updateFields: Partial<User> = {},
): Promise<User | undefined> => {
  try {
    const resp = await clientFetch(apiRoutes.user.updateUser, updateFields)
    const user = resp.data as User
    setUserCookie(user)
    return user
  } catch (error) {
    console.log('Error updating user', error)
    return undefined
  }
}

export const userIsAdmin = (user: User | null | undefined): boolean => {
  return userHasRole(user, USER_ROLES.ADMIN)
}

export const userHasRole = (
  user: User | null | undefined,
  role: string,
): boolean => {
  return user?.roles?.includes(role as UserRole) ?? false
}

export const USER_ROLES = {
  SALES: 'sales' as const,
  CANDIDATE: 'candidate' as const,
  ADMIN: 'admin' as const,
  CAMPAIGN_MANAGER: 'campaignManager' as const,
  DEMO: 'demo' as const,
}
