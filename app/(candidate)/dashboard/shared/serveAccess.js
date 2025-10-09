import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

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
  const campaignStatus = await fetchCampaignStatus()
  const user = await getServerUser()

  // TODO: add server user check
  if (!user) {
    return redirect('/dashboard')
  }
}
