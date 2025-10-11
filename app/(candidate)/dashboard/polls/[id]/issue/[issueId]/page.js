import pageMetaData from 'helpers/metadataHelper'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'
import { polls, pollIssues } from '../../../tempData'
import PollIssueDetailPage from './components/PollIssueDetailPage'
import { IssueProvider } from './hooks/IssueProvider'
import { PollProvider } from '../../hooks/PollProvider'

const meta = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  await serveAccess()
  const { id, issueId } = params
  const poll = polls.find((poll) => poll.id === parseInt(id))
  const issue = pollIssues.find((issue) => issue.id === parseInt(issueId))
  const pathname = `/dashboard/polls/${id}/issue/${issueId}`
  return (
    <IssueProvider issue={issue}>
      <PollProvider poll={poll}>
        <PollIssueDetailPage pathname={pathname} />
      </PollProvider>
    </IssueProvider>
  )
}
