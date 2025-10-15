import pageMetaData from 'helpers/metadataHelper'
import PollWelcomePage from './components/PollWelcomePage'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve',
  description: 'Welcome to GoodParty.org Serve',
  slug: '/polls/welcome',
})

export const metadata = meta

export default async function Page({ searchParams }) {
  await serveAccess()
  const childProps = {}

  return <PollWelcomePage {...childProps} />
}
