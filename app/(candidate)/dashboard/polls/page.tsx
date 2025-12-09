import pageMetaData from 'helpers/metadataHelper'
import PollsPage from './components/PollsPage'
import serveAccess from '../shared/serveAccess'
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

  return <PollsPage pathname="/dashboard/polls" polls={polls} />
}
