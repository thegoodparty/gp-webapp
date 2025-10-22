import pageMetaData from 'helpers/metadataHelper'
import PollsDetailPage from './components/PollsDetailPage'
import serveAccess from '../../shared/serveAccess'
import { PollProvider } from '../shared/hooks/PollProvider'
// import { getPoll, getPollTopIssues } from '../shared/serverApiCalls'
import { IssuesProvider } from '../shared/hooks/IssuesProvider'
import { getPoll, getPollTopIssues } from '../shared/serverApiCalls'

const meta = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  await serveAccess()
  const { id } = await params
  const poll = await getPoll(id)
  const issues = (await getPollTopIssues(id))?.results || []

  return (
    <PollProvider poll={poll}>
      <IssuesProvider issues={issues}>
        <PollsDetailPage pathname="/dashboard/polls" />
      </IssuesProvider>
    </PollProvider>
  )
}
