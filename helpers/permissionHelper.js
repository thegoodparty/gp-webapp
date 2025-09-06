import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import { USER_ROLES, userHasRole, userIsAdmin } from 'helpers/userHelper'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

async function checkIsAdmin() {
  try {
    const resp = await serverFetch(apiRoutes.user.getUser)

    return userIsAdmin(resp.data)
  } catch (e) {
    console.log('error at fetchDkCampaign', e)
    return false
  }
}

export const canCreateCampaigns = async () => {
  const user = await getServerUser()

  if (!userHasRole(user, USER_ROLES.SALES) && !userIsAdmin(user)) {
    redirect('/login')
  }
}

export const adminAccessOnly = async () => {
  const user = await getServerUser()
  if (!userIsAdmin(user)) {
    redirect('/login')
  }
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    redirect('/')
  }
}

export const portalAccessOnly = (role) => {
  if (!role) {
    redirect('/login')
  }
}
