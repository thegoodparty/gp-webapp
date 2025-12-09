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

type DomainPageProps = { pathname?: string }

export default function DomainPage({ pathname }: DomainPageProps): React.JSX.Element {
  const router = useRouter()
  const { status } = useDomainStatus()
  const { website } = useWebsite()
  const { domain } = website || {}
  const { message, paymentStatus } = status || {}

  useEffect(() => {
    if (
      website?.id &&
      domain?.name &&
      paymentStatus === PAYMENT_STATUS.SUCCEEDED &&
      message === DOMAIN_STATUS.INACTIVE
    ) {
      sendToPurchaseDomainFlow({
        websiteId: website.id as string | number,
        domainName: domain.name as string,
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
    ([
      DOMAIN_STATUS.IN_PROGRESS,
      DOMAIN_STATUS.SUBMITTED,
      DOMAIN_STATUS.SUCCESSFUL,
    ] as string[]).includes(String(message))

  return (
    <DashboardLayout pathname={pathname} campaign={{}} showAlert={false} hideMenu>
      {showDomainSelection && <SelectDomain onRegisterSuccess={() => {}} />}
      {showError && <DomainError />}
      {isSuccessfulPurchase && <DomainPurchaseSuccess />}
    </DashboardLayout>
  )
}
