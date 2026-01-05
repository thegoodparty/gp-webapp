import pageMetaData from 'helpers/metadataHelper'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'
import PollIssueDetailPage from './components/PollIssueDetailPage'
import { IssueProvider } from '../../../shared/hooks/IssueProvider'
import { PollProvider } from '../../../shared/hooks/PollProvider'
import { getPoll, getPollTopIssues } from '../../../shared/serverApiCalls'
import { notFound, redirect } from 'next/navigation'

const meta = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({
  params,
}: PageProps<'/dashboard/polls/[id]/issue/[issueIndex]'>) {
  await serveAccess()
  const { id, issueIndex } = await params
  const poll = await getPoll(id)
  if (!poll) {
    redirect('/dashboard/polls')
  }
  const issues = (await getPollTopIssues(id))?.results || []

  const issueIndexNum = parseInt(issueIndex, 10)
  if (
    isNaN(issueIndexNum) ||
    issueIndexNum < 0 ||
    issueIndexNum >= issues.length ||
    !issues[issueIndexNum]
  ) {
    notFound()
  }
  const issue = issues[issueIndexNum]
  const pathname = `/dashboard/polls/${id}/issue/${issueIndex}`

  return (
    <IssueProvider issue={issue}>
      <PollProvider poll={poll}>
        <PollIssueDetailPage pathname={pathname} />
      </PollProvider>
    </IssueProvider>
  )
}
