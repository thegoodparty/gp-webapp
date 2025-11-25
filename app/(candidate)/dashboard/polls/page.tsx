import pageMetaData from 'helpers/metadataHelper'
import PollsPage from './components/PollsPage'
import serveAccess from '../shared/serveAccess'
import { redirect } from 'next/navigation'
import { getPolls } from './shared/serverApiCalls'

export const metadata = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})

export const dynamic = 'force-dynamic'

export default async function Page() {
  await serveAccess()
  const getPollsResponse = await getPolls()

  const polls = getPollsResponse?.results || []

  if (polls.length === 1) {
    return redirect(`/dashboard/polls/${polls[0]?.id}`)
  }

  return <PollsPage pathname="/dashboard/polls" polls={polls} />
}
