import type React from 'react'
import pageMetaData from 'helpers/metadataHelper'
import WebsitePage from './components/WebsitePage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { WebsiteProvider, Website, Contact } from './components/WebsiteProvider'
import candidateAccess from '../shared/candidateAccess'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'

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
    serverFetch<Contact[] | Record<string, string | number | boolean | object | null | undefined>>(
      apiRoutes.website.getContacts,
    ),
  ])

  const website = websiteResp.ok ? (websiteResp.data as Website) : null
  const contacts = contactsResp.ok
    ? (contactsResp.data as Contact[] | Record<string, string | number | boolean | object | null | undefined>)
    : null

  return (
    <>
      <HubSpotChatWidgetScript />
      <WebsiteProvider website={website} contacts={contacts}>
        <WebsitePage pathname="/dashboard/website" />
      </WebsiteProvider>
    </>
  )
}
