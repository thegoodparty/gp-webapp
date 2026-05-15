import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from 'app/dashboard/shared/candidateAccess'
import { getServerUser } from 'helpers/userServerHelper'
import SuccessPage from './components/SuccessPage'

const meta = pageMetaData({
  title: 'Your Campaign Plan | GoodParty.org',
  description: 'Your campaign plan is ready.',
  slug: '/onboarding/success',
})

export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const initialUser = await getServerUser()
  return <SuccessPage initialUser={initialUser} />
}
