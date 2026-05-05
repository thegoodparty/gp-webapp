import pageMetaData from 'helpers/metadataHelper'
import ElectionFiling from './components/ElectionFiling'
import candidateAccess from 'app/dashboard/shared/candidateAccess'

const meta = pageMetaData({
  title: 'Election Filing | GoodParty.org',
  description: 'Election filing settings for GoodParty.org.',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  return <ElectionFiling />
}
