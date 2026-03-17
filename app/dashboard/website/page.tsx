import pageMetaData from 'helpers/metadataHelper'
import WebsitePage from './components/WebsitePage'
import { fetchUserWebsite } from 'helpers/fetchUserWebsite'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { WebsiteProvider } from './components/WebsiteProvider'
import candidateAccess from '../shared/candidateAccess'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'
import type { WebsiteContact } from 'helpers/types'

const meta = pageMetaData({
  title: 'Website | GoodParty.org',
  description: 'Website',
  slug: '/dashboard/website',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  const [website, contactsResp] = await Promise.all([
    fetchUserWebsite(),
    serverFetch<WebsiteContact[]>(apiRoutes.website.getContacts),
  ])

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
