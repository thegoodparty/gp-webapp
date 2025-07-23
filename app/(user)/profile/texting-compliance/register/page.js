import pageMetaData from 'helpers/metadataHelper'
import TextingComplianceRegisterPage from './components/TextingComplianceRegisterPage'

const meta = pageMetaData({
  title: 'Register - Texting Compliance | GoodParty.org',
  description: 'Register for texting compliance.',
})
export const metadata = meta

export default function Page() {
  return <TextingComplianceRegisterPage />
} 