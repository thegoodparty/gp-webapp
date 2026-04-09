import pageMetaData from 'helpers/metadataHelper'
import serveAccess from '../../shared/serveAccess'
import { getBriefing } from '../shared/serverApiCalls'
import BriefingDetailPage from './components/BriefingDetailPage'
import { redirect } from 'next/navigation'

export const metadata = pageMetaData({
  title: 'Meeting Briefing | GoodParty.org',
  description: 'AI-prepared briefing for your upcoming council meeting',
  slug: '/dashboard/briefings',
})

export const dynamic = 'force-dynamic'

interface Params {
  date: string
}

export default async function Page({
  params,
}: {
  params: Promise<Params>
}): Promise<React.JSX.Element> {
  await serveAccess()
  const { date } = await params
  const briefing = await getBriefing(date)
  if (!briefing) {
    redirect('/dashboard/briefings')
  }

  return <BriefingDetailPage briefing={briefing} />
}
