import pageMetaData from 'helpers/metadataHelper'
import serveAccess from '../../../shared/serveAccess'
import { getBriefing } from '../../shared/serverApiCalls'
import IssueDetailPage from './components/IssueDetailPage'
import { redirect } from 'next/navigation'

export const metadata = pageMetaData({
  title: 'Issue Detail | GoodParty.org',
  description: 'Full briefing for a priority agenda issue',
  slug: '/dashboard/briefings',
})

export const dynamic = 'force-dynamic'

interface Params {
  date: string
  issueNumber: string
}

export default async function Page({
  params,
}: {
  params: Promise<Params>
}): Promise<React.JSX.Element> {
  await serveAccess()
  const { date, issueNumber } = await params
  const briefing = await getBriefing(date)
  if (!briefing) {
    redirect('/dashboard/briefings')
  }

  const num = parseInt(issueNumber, 10)
  const issue = briefing.priorityIssues.find((i) => i.number === num)
  if (!issue) {
    redirect(`/dashboard/briefings/${date}`)
  }

  return <IssueDetailPage briefing={briefing} issueNumber={num} />
}
