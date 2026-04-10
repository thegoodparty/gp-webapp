import pageMetaData from 'helpers/metadataHelper'
import serveAccess from '../shared/serveAccess'
import { listBriefings } from './shared/serverApiCalls'
import { redirect } from 'next/navigation'
import BriefingsPage from './components/BriefingsPage'

export const metadata = pageMetaData({
  title: 'Briefings | GoodParty.org',
  description: 'Meeting briefings for your upcoming council meetings',
  slug: '/dashboard/briefings',
})

export const dynamic = 'force-dynamic'

export default async function Page() {
  await serveAccess()
  const briefings = await listBriefings()

  // Redirect to most recent briefing if one exists — matches Lovable design
  if (briefings.length > 0 && briefings[0]) {
    redirect(`/dashboard/briefings/${briefings[0].date}`)
  }

  return <BriefingsPage pathname="/dashboard/briefings" />
}
