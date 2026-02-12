import pageMetaData from 'helpers/metadataHelper'
import PurchasePage from './components/PurchasePage'
import candidateAccess from '../shared/candidateAccess'
import { PURCHASE_TYPES, PurchaseType } from 'helpers/purchaseTypes'
import { PurchaseIntentProvider } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { notFound } from 'next/navigation'
import type { SearchParams } from 'next/dist/server/request/search-params'

const meta = pageMetaData({
  title: 'Purchase page | GoodParty.org',
  description: 'Purchase page',
  slug: '/dashboard/purchase',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

interface PurchaseParams {
  domainName: string | undefined
  websiteId: string | undefined
}

const buildMetadata = (
  type: PurchaseType,
  params: PurchaseParams,
): Partial<Record<string, string | number | boolean | undefined>> => {
  switch (type) {
    case PURCHASE_TYPES.DOMAIN_REGISTRATION:
      return {
        domainName: params.domainName,
        websiteId: parseInt(params.websiteId || ''),
      }
    default:
      return {}
  }
}

const PURCHASE_TYPE_VALUES: PurchaseType[] = Object.values(PURCHASE_TYPES)

const isPurchaseType = (type: string): type is PurchaseType => {
  return PURCHASE_TYPE_VALUES.some((pt) => pt === type)
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function Page({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  await candidateAccess()
  const { type, domain, websiteId, returnUrl } = await searchParams

  if (!type || typeof type !== 'string' || !isPurchaseType(type)) {
    return notFound()
  }

  const domainStr = typeof domain === 'string' ? domain : undefined
  const websiteIdStr = typeof websiteId === 'string' ? websiteId : undefined
  const returnUrlStr = typeof returnUrl === 'string' ? returnUrl : undefined

  return (
    <PurchaseIntentProvider
      type={type}
      purchaseMetaData={buildMetadata(type, {
        domainName: domainStr,
        websiteId: websiteIdStr,
      })}
    >
      <PurchasePage type={type} domain={domainStr} returnUrl={returnUrlStr} />
    </PurchaseIntentProvider>
  )
}
