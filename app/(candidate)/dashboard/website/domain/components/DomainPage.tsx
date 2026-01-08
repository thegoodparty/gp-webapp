'use client'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import SelectDomain from './SelectDomain'
import { useDomainStatus } from './DomainStatusProvider'
import {
  DOMAIN_STATUS,
  PAYMENT_STATUS,
  sendToPurchaseDomainFlow,
} from '../../util/domain.util'
import { useWebsite } from '../../components/WebsiteProvider'
import DomainError from './DomainError'
import DomainPurchaseSuccess from './DomainPurchaseSuccess'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Campaign } from 'helpers/types'

interface DomainPageProps {
  pathname?: string
  campaign: Campaign | null
}

export default function DomainPage({ pathname, campaign }: DomainPageProps): React.JSX.Element {
  const router = useRouter()
  const { status } = useDomainStatus()
  const { website } = useWebsite()
  const domain = website?.domain
  const message = status?.message
  const paymentStatus = status?.paymentStatus

  useEffect(() => {
    if (
      website?.id &&
      domain?.name &&
      paymentStatus === PAYMENT_STATUS.SUCCEEDED &&
      message === DOMAIN_STATUS.INACTIVE
    ) {
      sendToPurchaseDomainFlow({
        websiteId: website.id,
        domainName: domain.name,
        router,
      })
    }
  }, [website, paymentStatus, message, domain, router])

  const showDomainSelection = message === DOMAIN_STATUS.NO_DOMAIN && !domain
  const showError =
    message === DOMAIN_STATUS.ERROR ||
    paymentStatus === DOMAIN_STATUS.ERROR ||
    (message === DOMAIN_STATUS.NO_DOMAIN &&
      paymentStatus === PAYMENT_STATUS.SUCCEEDED)

  const isSuccessfulPurchase =
    paymentStatus === PAYMENT_STATUS.SUCCEEDED &&
    message !== undefined &&
    [
      DOMAIN_STATUS.IN_PROGRESS,
      DOMAIN_STATUS.SUBMITTED,
      DOMAIN_STATUS.SUCCESSFUL,
    ].includes(message)

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false} hideMenu>
      {showDomainSelection && <SelectDomain />}
      {showError && <DomainError />}
      {isSuccessfulPurchase && <DomainPurchaseSuccess />}
    </DashboardLayout>
  )
}
