import pageMetaData from 'helpers/metadataHelper'
import ElectionResultPage from './components/ElectionResultPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'

const meta = pageMetaData({
  title: 'Election Result | GoodParty.org',
  description: 'Election Result',
  slug: '/dashboard/election-result',
})

export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page({}) {
  await candidateAccess()

  return <ElectionResultPage />
}
