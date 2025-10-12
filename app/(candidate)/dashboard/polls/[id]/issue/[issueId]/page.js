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
  const { id, issueId } = await params
  const poll = await getPoll(id)
  const issues = await getPollTopIssues(id)
  const issue = issues.find((issue) => issue.id === issueId)
  const pathname = `/dashboard/polls/${id}/issue/${issueId}`

  return (
    <IssueProvider issue={issue}>
      <PollProvider poll={poll}>
        <PollIssueDetailPage pathname={pathname} />
      </PollProvider>
    </IssueProvider>
  )
}
