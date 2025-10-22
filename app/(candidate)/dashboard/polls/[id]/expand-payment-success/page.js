import pageMetaData from 'helpers/metadataHelper'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'
import { redirect } from 'next/navigation'
import ExpandPaymentSuccessPage from './components/ExpandPaymentPage'
import { PollProvider } from '../../shared/hooks/PollProvider'
import { getPoll } from '../../shared/serverApiCalls'

const meta = pageMetaData({
  title: 'Expand Poll | GoodParty.org',
  description: 'Expand Poll',
  slug: '/dashboard/polls',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }) {
  await serveAccess()
  const { id } = await params
  const poll = await getPoll(id)
  const { count } = await searchParams
  if (!count) {
    redirect(`/dashboard/polls/${id}/expand`)
  }

  const childProps = { count }

  return (
    <PollProvider poll={poll}>
      <ExpandPaymentSuccessPage {...childProps} />
    </PollProvider>
  )
}
