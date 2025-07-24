import pageMetaData from 'helpers/metadataHelper'
import TextingComplianceRegisterPage from './components/TextingComplianceRegisterPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { getServerUser } from 'helpers/userServerHelper'

const meta = pageMetaData({
  title: 'Register - Texting Compliance | GoodParty.org',
  description: 'Register for texting compliance.',
})
export const metadata = meta

// <<<<<<< HEAD
const Page = async () => {
  await candidateAccess()
  const user = await getServerUser()
  const campaign = await fetchUserCampaign()

  return (
    <TextingComplianceRegisterPage
      {...{
        user,
        campaign,
      }}
    />
  )
  // =======
  // const Page = () => {
  //   return <TextingComplianceRegisterPage />
  // >>>>>>> origin/develop
}

export default Page
