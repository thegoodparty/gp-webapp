import pageMetaData from 'helpers/metadataHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
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

  const { type, domain, websiteId, returnUrl } = searchParams

  let purchaseIntent = null
  let error = null

  // Validate purchase type
  if (!type || !PURCHASE_TYPES[type]) {
    error = 'Invalid purchase type'
  } else {
    // Create purchase intent on server
    try {
      const metadata = buildMetadata(type, { domainName: domain, websiteId })
      const response = await serverFetch(
        apiRoutes.payments.createPurchaseIntent,
        {
          type,
          metadata,
        },
      )

      if (response.ok) {
        purchaseIntent = response.data
      } else {
        error = response.data?.error || 'Failed to initialize purchase'
      }
    } catch (err) {
      error = 'Failed to initialize purchase'
    }
  }

  const childProps = {
    type,
    domain,
    websiteId,
    returnUrl,
    purchaseIntent,
    error,
  }

  return <PurchasePage {...childProps} />
}
