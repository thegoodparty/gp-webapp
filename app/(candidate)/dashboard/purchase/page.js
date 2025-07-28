import pageMetaData from 'helpers/metadataHelper'
import PurchasePage from './components/PurchasePage'
import candidateAccess from '../shared/candidateAccess'
import { PURCHASE_TYPES } from '/helpers/purchaseTypes'

const meta = pageMetaData({
  title: 'Purchase page | GoodParty.org',
  description: 'Purchase page',
  slug: '/dashboard/purchase',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

const buildMetadata = (type, params) => {
  switch (type) {
    case PURCHASE_TYPES.DOMAIN_REGISTRATION:
      return {
        domainName: params.domainName,
        websiteId: parseInt(params.websiteId),
      }
    default:
      return {}
  }
}

export default async function Page({ searchParams }) {
  await candidateAccess()

  const { type, domain, websiteId, returnUrl } = await searchParams


  const childProps = {
    type,
    domain,
    websiteId,
    returnUrl,
  }

  return <PurchasePage {...childProps} />
}
