import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import { USER_ROLES, userHasRole, userIsAdmin } from 'helpers/userHelper'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { UserResponse } from './types'

const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const resp = (await serverFetch(apiRoutes.user.getUser)) as UserResponse

    return userIsAdmin(resp.data)
  } catch (e) {
    console.log('error at fetchDkCampaign', e)
    return false
  }
}

export const canCreateCampaigns = async (): Promise<void> => {
  const user = await getServerUser()

  if (!userHasRole(user, USER_ROLES.SALES) && !userIsAdmin(user)) {
    redirect('/login')
  }
}

export const adminAccessOnly = async (): Promise<void> => {
  const user = await getServerUser()
  if (!userIsAdmin(user)) {
    redirect('/login')
  }
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    redirect('/logout')
  }
}

export const portalAccessOnly = (role: string | null | undefined): void => {
  if (!role) {
    redirect('/login')
  }
}
