'use client'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import SelectDomain from './SelectDomain'
import { useDomainStatus } from './DomainStatusProvider'
import { DOMAIN_STATUS, PAYMENT_STATUS } from '../../util/domain.util'
import { useWebsite } from '../../components/WebsiteProvider'
import DomainError from './DomainError'
import DomainPurchaseSuccess from './DomainPurchaseSuccess'

export default function DomainPage({ pathname }) {
  const handleSuccess = () => setSuccess(true)
  const { status } = useDomainStatus()
  const { website } = useWebsite()
  const { domain } = website

  const { message, paymentStatus } = status || {}

  const showDomainSelection = message === DOMAIN_STATUS.NO_DOMAIN && !domain
  const showError =
    message === DOMAIN_STATUS.ERROR ||
    paymentStatus === DOMAIN_STATUS.ERROR ||
    (message === DOMAIN_STATUS.NO_DOMAIN &&
      paymentStatus === PAYMENT_STATUS.SUCCEEDED)

  const isSuccessfulPurchase =
    paymentStatus === PAYMENT_STATUS.SUCCEEDED &&
    (message === DOMAIN_STATUS.IN_PROGRESS ||
      message === DOMAIN_STATUS.SUBMITTED ||
      message === DOMAIN_STATUS.SUCCESSFUL)

  return (
    <DashboardLayout pathname={pathname} showAlert={false} hideMenu>
      {showDomainSelection && (
        <SelectDomain onRegisterSuccess={handleSuccess} />
      )}
      {showError && <DomainError />}
      {isSuccessfulPurchase && <DomainPurchaseSuccess />}
    </DashboardLayout>
  )
}
