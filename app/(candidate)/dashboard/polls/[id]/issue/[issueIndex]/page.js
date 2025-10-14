import pageMetaData from 'helpers/metadataHelper'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'
import PollIssueDetailPage from './components/PollIssueDetailPage'
import { IssueProvider } from '../../../shared/hooks/IssueProvider'
import { PollProvider } from '../../../shared/hooks/PollProvider'
import { getPoll, getPollTopIssues } from '../../../shared/serverApiCalls'

const meta = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  await serveAccess()
  const { id, issueIndex } = await params
  const poll = await getPoll(id)
  const issues = (await getPollTopIssues(id))?.results || []

  const issue = issues[issueIndex]
  const pathname = `/dashboard/polls/${id}/issue/${issueIndex}`

  return (
    <IssueProvider issue={issue}>
      <PollProvider poll={poll}>
        <PollIssueDetailPage pathname={pathname} />
      </PollProvider>
    </IssueProvider>
  )
}
