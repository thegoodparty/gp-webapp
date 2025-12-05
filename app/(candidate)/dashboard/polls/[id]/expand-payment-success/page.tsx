import pageMetaData from 'helpers/metadataHelper'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'
import { redirect } from 'next/navigation'
import ExpandPaymentSuccessPage from './components/ExpandPaymentPage'
import { PollProvider } from '../../shared/hooks/PollProvider'
import { getPoll } from '../../shared/serverApiCalls'

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
    return redirect('/dashboard/polls')
  }
  const { count } = await searchParams
  if (typeof count !== 'string') {
    redirect(`/dashboard/polls/${id}/expand`)
  }

  return (
    <PollProvider poll={poll}>
      <ExpandPaymentSuccessPage count={parseInt(count, 10)} />
    </PollProvider>
  )
}
