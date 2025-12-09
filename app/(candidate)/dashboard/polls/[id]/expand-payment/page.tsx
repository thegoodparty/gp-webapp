import pageMetaData from 'helpers/metadataHelper'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'
import ExpandPaymentPage from './components/ExpandPaymentPage'
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
  if (!count || typeof scheduledDate !== 'string') {
    redirect(`/dashboard/polls/${id}/expand`)
  }

  return (
    <PollProvider poll={poll}>
      <ExpandPaymentPage count={count} scheduledDate={scheduledDate} />
    </PollProvider>
  )
}
