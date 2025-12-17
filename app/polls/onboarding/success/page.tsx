import { ReactNode } from 'react'
import pageMetaData from 'helpers/metadataHelper'
import SuccessPage from './components/SuccessPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { requireAuth } from 'helpers/authHelper'
import { redirect } from 'next/navigation'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve Onboarding',
  description: 'Welcome to GoodParty.org Serve Onboarding',
  slug: '/polls/onboarding/success',
})

export const metadata = meta

export default async function Page({
  searchParams,
}: PageProps<any>): Promise<ReactNode> {
  await requireAuth()
  await candidateAccess()

  const { pollId } = await searchParams

  if (typeof pollId !== 'string') {
    return redirect('/dashboard/polls')
  }

  return <SuccessPage pollId={pollId} />
}
