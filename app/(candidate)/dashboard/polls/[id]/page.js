import pageMetaData from 'helpers/metadataHelper'
import PollsDetailPage from './components/PollsDetailPage'
import serveAccess from '../../shared/serveAccess'
import { polls } from '../tempData'
import { PollProvider } from './hooks/PollProvider'

const meta = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  await serveAccess()
  const { id } = params
  const poll = polls.find((poll) => poll.id === parseInt(id))

  return (
    <PollProvider poll={poll}>
      <PollsDetailPage pathname="/dashboard/polls" />
    </PollProvider>
  )
}
