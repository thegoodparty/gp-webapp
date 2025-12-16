import pageMetaData from 'helpers/metadataHelper'
import WebsitePage from './components/WebsitePage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { WebsiteProvider } from './components/WebsiteProvider'
import candidateAccess from '../shared/candidateAccess'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'

interface WebsiteContent {
  hero?: {
    headline?: string
    subheadline?: string
  }
  about?: {
    title?: string
    content?: string
  }
  theme?: {
    color?: string
  }
}

interface Website {
  id: number
  vanityPath: string
  status: string
  content: WebsiteContent | null
  domain?: { domain: string; status: string } | null
}

interface WebsiteContact {
  id: number
  email: string
  name?: string
  createdAt: string
}

const meta = pageMetaData({
  title: 'Website | GoodParty.org',
  description: 'Website',
  slug: '/dashboard/website',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  const [websiteResp, contactsResp] = await Promise.all([
    serverFetch<Website>(apiRoutes.website.get),
    serverFetch<WebsiteContact[]>(apiRoutes.website.getContacts),
  ])

  const website = websiteResp.ok ? websiteResp.data : null
  const contacts = contactsResp.ok ? contactsResp.data : null

  return (
    <>
      <HubSpotChatWidgetScript />
      <WebsiteProvider website={website} contacts={contacts}>
        <WebsitePage pathname="/dashboard/website" />
      </WebsiteProvider>
    </>
  )
}
