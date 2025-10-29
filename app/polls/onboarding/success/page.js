import pageMetaData from 'helpers/metadataHelper'
import SuccessPage from './components/SuccessPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { requireAuth } from 'helpers/authHelper'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve Onboarding',
  description: 'Welcome to GoodParty.org Serve Onboarding',
  slug: '/polls/onboarding/success',
})

export const metadata = meta

export default async function Page({}) {
  await requireAuth()
  await candidateAccess()

  return <SuccessPage />
}
