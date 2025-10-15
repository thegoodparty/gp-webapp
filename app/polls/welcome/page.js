import pageMetaData from 'helpers/metadataHelper'
import PollWelcomePage from './components/PollWelcomePage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { requireAuth } from 'helpers/authHelper'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve',
  description: 'Welcome to GoodParty.org Serve',
  slug: '/polls/welcome',
})

export const metadata = meta

export default async function Page({ searchParams }) {
  await requireAuth('/polls/welcome')
  await candidateAccess()

  const childProps = {}

  return <PollWelcomePage {...childProps} />
}
