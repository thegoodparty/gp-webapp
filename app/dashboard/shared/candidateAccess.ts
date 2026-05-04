import { auth } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { getCurrentUserOrganizations } from 'helpers/getCurrentUserOrganizations'
import { getServerUser } from 'helpers/userServerHelper'
import {
  resolvePostAuthRedirectPath,
  CampaignStatus,
} from 'helpers/resolvePostAuthRedirectPath.util'

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

const fetchHasElectedOffice = async (): Promise<boolean> => {
  try {
    const resp = await serverFetch(apiRoutes.electedOffice.current)
    return resp.ok
  } catch {
    return false
  }
}

export async function getPostAuthRedirectPath(): Promise<string> {
  const [user, campaignStatus, hasElectedOffice] = await Promise.all([
    getServerUser(),
    fetchCampaignStatus(),
    fetchHasElectedOffice(),
  ])

  return resolvePostAuthRedirectPath(user, campaignStatus, hasElectedOffice)
}

export default async function candidateAccess(): Promise<void> {
  const { userId, actor } = await auth()

  if (!userId) {
    return redirect('/sign-up')
  }

  // `candidateAccess` is also used by non-dashboard routes (e.g. `/polls/*`); only
  // bounce orgless users away from `/dashboard` where the UI assumes an organization.
  const pathname = (await headers()).get('x-pathname') ?? ''
  if (pathname.startsWith('/dashboard')) {
    const organizations = await getCurrentUserOrganizations()
    if (organizations.length === 0) {
      return redirect('/onboarding/office-selection')
    }
  }

  // Skip the legacy token check for impersonated sessions — actor tokens are Clerk JWTs
  // and won't have the legacy cookie that fetchCampaignStatus checks for (which would
  // return 498 and incorrectly sign out the session).
  // don't remove this call for non-impersonated users. It prevents the build process
  // from trying to cache this page which should be dynamic
  // https://nextjs.org/docs/messages/dynamic-server-error
  if (!actor) {
    await fetchCampaignStatus()
  }
}
