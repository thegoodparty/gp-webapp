import pageMetaData from 'helpers/metadataHelper'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'
import ExpandPollPage from './components/ExpandPollPage'
import { PollProvider } from '../../shared/hooks/PollProvider'
import { getPoll } from '../../shared/serverApiCalls'

const meta = pageMetaData({
  title: 'Expand Poll | GoodParty.org',
  description: 'Expand Poll',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  await serveAccess()
  const { id } = await params
  const poll = await getPoll(id)

  return (
    <PollProvider poll={poll}>
      <ExpandPollPage />
    </PollProvider>
  )
}
