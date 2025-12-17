import pageMetaData from 'helpers/metadataHelper'
import WebsiteEditorPage from './components/WebsiteEditorPage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import { WebsiteProvider } from '../components/WebsiteProvider'
import candidateAccess from '../../shared/candidateAccess'

const meta = pageMetaData({
  title: 'Website Editor | GoodParty.org',
  description: 'Website Editor',
  slug: '/dashboard/website/editor',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

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

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  const resp = await serverFetch<Website>(apiRoutes.website.get, {})
  const website = resp.ok ? resp.data : null

  if (!website) {
    redirect('/dashboard/website')
  }

  return (
    <WebsiteProvider website={website} contacts={null}>
      <WebsiteEditorPage pathname="/dashboard/website/editor" />
    </WebsiteProvider>
  )
}
