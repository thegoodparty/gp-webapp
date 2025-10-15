import { redirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'

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
  // don't remove this call. It prevents the build process to try to cache this page which should be dynamic
  // https://nextjs.org/docs/messages/dynamic-server-error
  const campaign = await fetchUserCampaign()

  if (!campaign?.details?.wonGeneral) {
    return redirect('/dashboard')
  }
}
