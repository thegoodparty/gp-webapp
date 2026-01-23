import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

interface CampaignStatus {
  status: string | boolean
  slug?: string
  currentStep?: string
}

export async function fetchCampaignStatus(): Promise<CampaignStatus> {
  try {
    const resp = await serverFetch<CampaignStatus>(apiRoutes.campaign.status)
    if (resp.status === 498) {
      redirect('/logout')
    }
    return resp.data
  } catch (e) {
    console.log('error at fetchCampaignStatus', e)
    return { status: false }
  }
}

export default async function candidateAccess(): Promise<void> {
  // don't remove this call. It prevents the build process to try to cache this page which should be dynamic
  // https://nextjs.org/docs/messages/dynamic-server-error
  await fetchCampaignStatus()
  const user = await getServerUser()

  if (!user) {
    return redirect('/sign-up')
  }
}
