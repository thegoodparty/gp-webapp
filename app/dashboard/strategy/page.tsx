import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import StrategyPage from './components/StrategyPage'

const meta = pageMetaData({
  title: 'Strategy | GoodParty.org',
  description: 'Strategy',
  slug: '/dashboard/strategy',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  return <StrategyPage pathname="/dashboard/strategy" />
}
