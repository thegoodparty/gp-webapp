import pageMetaData from 'helpers/metadataHelper'
import PollsDetailPage from './components/PollsDetailPage'
import serveAccess from '../../shared/serveAccess'
import { PollProvider } from '../shared/hooks/PollProvider'
import { IssuesProvider } from '../shared/hooks/IssuesProvider'
import { getPoll, getPollTopIssues } from '../shared/serverApiCalls'
import { redirect } from 'next/navigation'

const meta = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

interface Params {
  id: string
}

export default async function Page({
  params,
}: {
  params: Promise<Params>
}): Promise<React.JSX.Element> {
  await serveAccess()
  const { id } = await params
  const poll = await getPoll(id)
  if (!poll) {
    redirect('/dashboard/polls')
  }
  const issues = (await getPollTopIssues(id))?.results || []

  return (
    <PollProvider poll={poll}>
      <IssuesProvider issues={issues}>
        <PollsDetailPage pathname="/dashboard/polls" />
      </IssuesProvider>
    </PollProvider>
  )
}
