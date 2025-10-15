import pageMetaData from 'helpers/metadataHelper'
import PollWelcomePage from './components/PollWelcomePage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import requireElectedOffice from '../shared/requireElectedOffice'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve',
  description: 'Welcome to GoodParty.org Serve',
  slug: '/polls/welcome',
})

export const metadata = meta

export default async function Page({ searchParams }) {
  await candidateAccess()
  await requireElectedOffice()
  const childProps = {}

  return <PollWelcomePage {...childProps} />
}
