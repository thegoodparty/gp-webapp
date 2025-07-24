import pageMetaData from 'helpers/metadataHelper'
import TextingComplianceSubmitPinPage from 'app/(user)/profile/texting-compliance/submit-pin/components/TextingComplianceSubmitPinPage'

const meta = pageMetaData({
  title: 'Submit PIN - Texting Compliance | GoodParty.org',
  description: 'Submit PIN for texting compliance verification.',
})
export const metadata = meta

const Page = () => {
  return <TextingComplianceSubmitPinPage />
}

export default Page
