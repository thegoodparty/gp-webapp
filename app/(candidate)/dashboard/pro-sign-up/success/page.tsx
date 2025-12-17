import pageMetaData from 'helpers/metadataHelper'
import PurchaseSuccessPage from 'app/(candidate)/dashboard/pro-sign-up/success/components/PurchaseSuccessPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { restrictDemoAccess } from 'app/(candidate)/dashboard/shared/restrictDemoAccess'

const meta = pageMetaData({
  title: 'Pro Sign Up - Purchase Success | GoodParty.org',
  description: 'Pro Sign Up - Purchase Success',
  slug: '/dashboard/pro-sign-up/success',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  await restrictDemoAccess()
  return <PurchaseSuccessPage />
}
