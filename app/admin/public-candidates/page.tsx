import { adminAccessOnly } from 'helpers/permissionHelper'
import pageMetaData from 'helpers/metadataHelper'
import PublicCandidates from './components/PublicCandidates'

const meta = pageMetaData({
  title: 'Public Candidates | GoodParty.org',
  description: 'Public Candidates',
  slug: '/admin/public-candidates',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page(): Promise<React.JSX.Element> {
  await adminAccessOnly()

  return <PublicCandidates />
}
