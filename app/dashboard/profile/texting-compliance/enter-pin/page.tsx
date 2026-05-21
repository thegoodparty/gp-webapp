import pageMetaData from 'helpers/metadataHelper'
import EnterPin from './components/EnterPin'
import candidateAccess from 'app/dashboard/shared/candidateAccess'

const meta = pageMetaData({
  title: 'Enter your PIN | GoodParty.org',
  description: 'Enter your CampaignVerify PIN to complete texting compliance.',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  return <EnterPin />
}
