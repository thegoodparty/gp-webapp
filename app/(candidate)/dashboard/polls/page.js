import pageMetaData from 'helpers/metadataHelper'
import PollsPage from './components/PollsPage'
import serveAccess from '../shared/serveAccess'
import { redirect } from 'next/navigation'
import { getPolls } from './shared/serverApiCalls'
import { PollsProvider } from './shared/hooks/PollsProvider'

const meta = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await serveAccess()
  const polls = await getPolls()
  const pollsCount = polls?.results?.length || 0

  if (pollsCount === 1) {
    return redirect(`/dashboard/polls/${polls?.results?.[0]?.id}`)
  }

  return (
    <PollsProvider polls={polls}>
      <PollsPage pathname="/dashboard/polls" />
    </PollsProvider>
  )
}
