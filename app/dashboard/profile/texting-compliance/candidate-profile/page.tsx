import pageMetaData from 'helpers/metadataHelper'
import CandidateProfile from './components/CandidateProfile'
import candidateAccess from 'app/dashboard/shared/candidateAccess'

const meta = pageMetaData({
  title: 'Candidate Profile | GoodParty.org',
  description: 'Candidate profile settings for GoodParty.org.',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  return <CandidateProfile />
}
