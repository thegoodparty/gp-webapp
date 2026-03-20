import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { getServerUser } from 'helpers/userServerHelper'

export interface CampaignStatus {
  status: string | boolean
  slug?: string
  step?: number
}

export function resolvePostAuthRedirectPath(
  user: { roles?: string[] } | null,
  campaignStatus: CampaignStatus | null,
): string {
  if (user?.roles?.includes('sales')) {
    return '/sales/add-campaign'
  }
  if (campaignStatus?.status === 'candidate') {
    return '/dashboard'
  }
  if (campaignStatus?.status === 'onboarding' && campaignStatus?.slug) {
    return `/onboarding/${campaignStatus.slug}/${campaignStatus.step ?? 1}`
  }
  return '/dashboard/profile'
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

  return resolvePostAuthRedirectPath(user, campaignStatus)
}

export default async function candidateAccess(): Promise<void> {
  const { userId } = await auth()

  if (!userId) {
    return redirect('/sign-up')
  }

  // don't remove this call. It prevents the build process from trying to to cache this page which should be dynamic
  // https://nextjs.org/docs/messages/dynamic-server-error
  await fetchCampaignStatus()
}
