import pageMetaData from 'helpers/metadataHelper'
import PollsPage from './components/PollsPage'
import serveAccess from '../shared/serveAccess'
import { polls } from './tempData'
import { redirect } from 'next/navigation'

const meta = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await serveAccess()
  const pollsCount = polls.length
  // TODO: remove this after we restore the list view
  if (pollsCount === 1) {
    return redirect(`/dashboard/polls/${polls[0].id}`)
  }

  return <PollsPage pathname="/dashboard/polls" />
}
