import pageMetaData from 'helpers/metadataHelper'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'
import ExpandPollPage from './components/ExpandPollPage'
import { PollProvider } from '../../shared/hooks/PollProvider'
import { getPoll } from '../../shared/serverApiCalls'
import { redirect } from 'next/navigation'
import { parseIntQueryParam } from '../expand-payment-success/page'

export const metadata = pageMetaData({
  title: 'Expand Poll | GoodParty.org',
  description: 'Expand Poll',
  slug: '/dashboard/polls',
})

export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }: PageProps<any>) {
  await serveAccess()
  const { id } = await params
  const poll = await getPoll(id)
  if (!poll) {
    redirect('/dashboard/polls')
  }
  const { count: countParam, scheduledDate } = await searchParams
  const count = parseIntQueryParam(countParam)
  return (
    <PollProvider poll={poll}>
      <ExpandPollPage
        count={count}
        scheduledDate={
          typeof scheduledDate === 'string'
            ? new Date(scheduledDate)
            : undefined
        }
      />
    </PollProvider>
  )
}
