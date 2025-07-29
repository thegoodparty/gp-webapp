import pageMetaData from 'helpers/metadataHelper'
import TextingComplianceSubmitPinPage from 'app/(user)/profile/texting-compliance/submit-pin/components/TextingComplianceSubmitPinPage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { redirect } from 'next/navigation'

const fetchTcrCompliance = async () => {
  const response = await serverFetch(apiRoutes.campaign.tcrCompliance.fetch)
  if (!response.ok) {
    throw new Error('Failed to fetch TCR Compliance data')
  }
  return response.data
}

const meta = pageMetaData({
  title: 'Submit PIN - Texting Compliance | GoodParty.org',
  description: 'Submit PIN for texting compliance verification.',
})
export const metadata = meta

const Page = async () => {
  await candidateAccess()
  let tcrCompliance
  try {
    tcrCompliance = await fetchTcrCompliance()
    if (!tcrCompliance) {
      throw new Error('TCR Compliance data not found')
    }
  } catch (e) {
    console.error('Error fetching TCR Compliance data:', e)
    return redirect('/profile')
  }

  return <TextingComplianceSubmitPinPage {...{ tcrCompliance }} />
}

export default Page
