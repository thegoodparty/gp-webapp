import pageMetaData from 'helpers/metadataHelper'
import { fetchUserWebsite } from 'helpers/fetchUserWebsite'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import candidateAccess from '../../shared/candidateAccess'
import DomainPage from './components/DomainPage'
import { WebsiteProvider } from '../components/WebsiteProvider'
import { DomainStatusProvider } from './components/DomainStatusProvider'
import { Campaign } from 'helpers/types'

const meta = pageMetaData({
  title: 'Add a domain | GoodParty.org',
  description: 'Add a domain',
  slug: '/dashboard/website/domain',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

interface DomainStatus {
  status: string
  domain: string
  verificationStatus?: string
}

const fetchCampaign = async (): Promise<Campaign | null> => {
  try {
    const resp = await serverFetch<Campaign>(apiRoutes.campaign.get)
    return resp.data
  } catch (e) {
    console.error('error fetching campaign', e)
    return null
  }
}

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const [website, statusRes, campaign] = await Promise.all([
    fetchUserWebsite(),
    serverFetch<DomainStatus>(apiRoutes.domain.status),
    fetchCampaign(),
  ])

  const status = statusRes.ok ? statusRes.data : null

  if (!website) {
    redirect('/dashboard/website')
  }

  return (
    <WebsiteProvider website={website} contacts={null}>
      <DomainStatusProvider status={status}>
        <DomainPage pathname="/dashboard/website/domain" campaign={campaign} />
      </DomainStatusProvider>
    </WebsiteProvider>
  )
}
