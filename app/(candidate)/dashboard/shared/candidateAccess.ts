import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { getServerUser } from 'helpers/userServerHelper'
import { USER_ROLES, userHasRole } from 'helpers/userHelper'

interface CampaignStatus {
  status: string | boolean
  slug?: string
  step?: number
}

export async function fetchCampaignStatus(): Promise<CampaignStatus> {
  try {
    const resp = await serverFetch<CampaignStatus>(apiRoutes.campaign.status)
    if (resp.status === 498) {
      redirect('/logout')
    }
    return resp.data
  } catch (e) {
    if (isRedirectError(e)) throw e
    console.log('error at fetchCampaignStatus', e)
    return { status: false }
  }
}

export async function getPostAuthRedirectPath(): Promise<string> {
  const [user, campaignStatus] = await Promise.all([
    getServerUser(),
    fetchCampaignStatus(),
  ])

  if (userHasRole(user, USER_ROLES.SALES)) {
    return '/sales/add-campaign'
  }

  const { status, slug, step } = campaignStatus
  if (status === 'candidate') {
    return '/dashboard'
  }
  if (status === 'onboarding' && slug) {
    return `/onboarding/${slug}/${step ?? 1}`
  }

  return '/profile'
}

export default async function candidateAccess(): Promise<void> {
  const { userId } = await auth()

  if (!userId) {
    return redirect('/sign-up')
  }

  // don't remove this call. It prevents the build process to try to cache this page which should be dynamic
  // https://nextjs.org/docs/messages/dynamic-server-error
  await fetchCampaignStatus()
}
