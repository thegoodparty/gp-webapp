import pageMetaData from 'helpers/metadataHelper'
import PollsDetailPage from './components/PollsDetailPage'
import serveAccess from '../../shared/serveAccess'
import { PollProvider } from '../shared/hooks/PollProvider'
// import { getPoll, getPollTopIssues } from '../shared/serverApiCalls'
import { IssuesProvider } from '../shared/hooks/IssuesProvider'

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
  // const poll = await getPoll(id)
  // const issues = (await getPollTopIssues(id))?.results || []
  const poll = tempPoll
  const issues = tempIssues

  return (
    <PollProvider poll={poll}>
      <IssuesProvider issues={issues}>
        <PollsDetailPage pathname="/dashboard/polls" />
      </IssuesProvider>
    </PollProvider>
  )
}

const tempPoll = {
  id: '0199ed0c-bf2f-7931-8bb5-e262dee52d80',
  status: 'completed',
  name: 'District 5 Community Survey',
  createdAt: '2025-10-01T10:00:00.000Z',
  completedAt: '2025-10-15T18:30:00.000Z',
  messageContent:
    "Hi, I'm Grand Rapids City Council Member Benjamin Schmitt. What local issues matter most to you? I'd genuinely value your input. Reply to share or text STOP to opt out.",
  imageUrl: 'https://assets.goodparty.org/candidates/ali--dieng-29ottg.jpeg',
  targetAudienceSize: 1200,
  responseCount: 100,
  lowConfidence: true,
  scheduledDate: '2025-01-01',
  estimatedCompletionDate: '2025-01-01',
  completedDate: '2025-01-01',
}

const tempIssues = [
  {
    id: 'issue-1',
    title: 'Infrastructure & Roads',
    summary:
      'Residents are concerned about deteriorating road conditions, lack of sidewalks in residential areas, and insufficient public transportation options. Many mentioned traffic congestion during peak hours.',
    mentionCount: 342,
  },
  {
    id: 'issue-2',
    title: 'Education Funding',
    summary:
      'Strong emphasis on increasing teacher salaries, updating school facilities, and providing more resources for special education programs. Parents expressed concerns about class sizes.',
    mentionCount: 298,
  },
  {
    id: 'issue-3',
    title: 'Public Safety',
    summary:
      'Community members highlighted the need for more police presence in certain neighborhoods, better street lighting, and faster emergency response times.',
    mentionCount: 256,
  },
]
