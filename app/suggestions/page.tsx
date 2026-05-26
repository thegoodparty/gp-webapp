import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../dashboard/shared/candidateAccess'
import DashboardLayout from '../dashboard/shared/DashboardLayout'
import SuggestionsPage from './components/SuggestionsPage'

const meta = pageMetaData({
  title: 'Campaign Manager / Weekly Briefings | GoodParty.org',
  description: 'Personalized suggestions based on quick check-in questions.',
  slug: '/suggestions',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  return (
    <DashboardLayout pathname="/suggestions" showAlert={false}>
      <SuggestionsPage />
    </DashboardLayout>
  )
}
