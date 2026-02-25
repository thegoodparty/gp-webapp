import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import PurchaseRedirectPage from 'app/(candidate)/dashboard/pro-sign-up/purchase-redirect/components/PurchaseRedirectPage'

const REDIRECT_COUNTDOWN_SECONDS = process.env.PAYMENT_REDIRECT_DELAY || 5

const meta = pageMetaData({
  title: 'Pro Sign Up - Purchase Redirect | GoodParty.org',
  description: 'Pro Sign Up - Purchase Redirect',
  slug: '/dashboard/pro-sign-up/purchase-redirect',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  const fetchedCampaign = await fetchUserCampaign()
  const campaign = (fetchedCampaign === null ? {} : fetchedCampaign) as {
    isPro?: boolean
  }

  const childProps = {
    campaign,
    redirectDelaySecs: REDIRECT_COUNTDOWN_SECONDS,
  }

  return <PurchaseRedirectPage {...childProps} />
}
