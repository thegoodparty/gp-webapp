import pageMetaData from 'helpers/metadataHelper'
import PollsDetailPage from './components/PollsDetailPage'
import serveAccess from '../../shared/serveAccess'

const meta = pageMetaData({
  title: 'Polls | GoodParty.org',
  description: 'Polls',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await serveAccess()

  return <PollsDetailPage pathname="/dashboard/polls" />
}
