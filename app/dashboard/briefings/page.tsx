import pageMetaData from 'helpers/metadataHelper'
import { briefingsLandingFixture } from '@shared/briefings/fixtures'
import BriefingsLanding from './components/BriefingsLanding'

const meta = pageMetaData({
  title: 'Briefings | GoodParty.org',
  description: 'Meeting briefings',
  slug: '/dashboard/briefings',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  // TODO: replace fixture with Swain's BriefingsApi once available.
  const summaries = briefingsLandingFixture
  return <BriefingsLanding summaries={summaries} />
}
