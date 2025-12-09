import type React from 'react'
import pageMetaData from 'helpers/metadataHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import candidateAccess from '../../shared/candidateAccess'
import DomainPage from './components/DomainPage'
import { WebsiteProvider, Website } from '../components/WebsiteProvider'
import { DomainStatusProvider, DomainStatus } from './components/DomainStatusProvider'

const meta = pageMetaData({
  title: 'Add a domain | GoodParty.org',
  description: 'Add a domain',
  slug: '/dashboard/website/domain',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const [websiteRes, statusRes] = await Promise.all([
    serverFetch<Website>(apiRoutes.website.get),
    serverFetch<DomainStatus>(apiRoutes.domain.status),
  ])

  const website = websiteRes.ok ? (websiteRes.data as Website) : null
  const status = statusRes.ok ? (statusRes.data as DomainStatus) : null

  if (!website) {
    redirect('/dashboard/website')
  }

  return (
    <WebsiteProvider website={website}>
      <DomainStatusProvider status={status}>
        <DomainPage pathname="/dashboard/website/domain" />
      </DomainStatusProvider>
    </WebsiteProvider>
  )
}
