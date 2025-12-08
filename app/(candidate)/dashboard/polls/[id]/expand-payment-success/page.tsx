import pageMetaData from 'helpers/metadataHelper'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'
import { redirect } from 'next/navigation'
import { PollProvider } from '../../shared/hooks/PollProvider'
import { getPoll } from '../../shared/serverApiCalls'
import ExpandPollLayout from '../expand/shared/ExpandPollLayout'
import { PollPaymentSuccess } from '../../shared/components/PollPaymentSuccess'

export const metadata = pageMetaData({
  title: 'Expand Poll | GoodParty.org',
  description: 'Expand Poll',
  slug: '/dashboard/polls',
})

export const dynamic = 'force-dynamic'

export const parseIntQueryParam = (param: string | string[] | undefined) => {
  if (typeof param !== 'string') {
    return undefined
  }
  const res = parseInt(param, 10)
  if (isNaN(res)) {
    return undefined
  }
  return res
}

export default async function Page({ params, searchParams }: PageProps<any>) {
  await serveAccess()
  const { id } = await params
  const poll = await getPoll(id)
  if (!poll) {
    return redirect('/dashboard/polls')
  }
  const { count: countParam, scheduledDate } = await searchParams

  const count = parseIntQueryParam(countParam)
  if (!count || typeof scheduledDate !== 'string') {
    redirect(`/dashboard/polls/${id}/expand`)
  }

  return (
    <PollProvider poll={poll}>
      <ExpandPollLayout showBreadcrumbs={false}>
        <PollPaymentSuccess
          className="flex flex-col items-center justify-center"
          scheduledDate={new Date(scheduledDate)}
          textsPaidFor={count}
          redirectTo={'/dashboard/polls'}
        />
      </ExpandPollLayout>
    </PollProvider>
  )
}
