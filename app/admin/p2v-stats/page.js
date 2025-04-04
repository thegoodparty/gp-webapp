import { adminAccessOnly } from 'helpers/permissionHelper'
import P2VStatsPage from './components/P2VStatsPage'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'P2V Stats | GoodParty.org',
  description: 'P2V Stats',
  slug: '/admin/p2v-stats',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page() {
  await adminAccessOnly()

  const childProps = {}
  return <P2VStatsPage {...childProps} />
}
