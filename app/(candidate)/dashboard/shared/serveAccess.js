import { redirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { serveAccessCriteria } from './serveAccessCriteria'

export async function fetchCampaignStatus() {
  try {
    const resp = await serverFetch(apiRoutes.campaign.status)
    if (resp.status === 498) {
      redirect('/dashboard')
    }
    return resp.data
  } catch (e) {
    console.log('error at fetchCampaignStatus', e)
    return { status: false }
  }
}

export default async function serveAccess() {
  const campaign = await fetchUserCampaign()

  if (!serveAccessCriteria(campaign)) {
    return redirect('/dashboard')
  }
}
