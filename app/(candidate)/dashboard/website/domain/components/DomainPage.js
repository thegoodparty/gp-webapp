'use client'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import SelectDomain from './SelectDomain'
import { useDomainStatus } from './DomainStatusProvider'
import { DOMAIN_STATUS } from '../../util/domain.util'
import { useWebsite } from '../../components/WebsiteProvider'

export default function DomainPage({ pathname }) {
  const handleSuccess = () => setSuccess(true)
  const { status } = useDomainStatus()
  const { website } = useWebsite()
  const { vanityPath, domain } = website

  const { message, paymentStatus } = status || {}

  const showDomainSelection = message === DOMAIN_STATUS.NO_DOMAIN && !domain
  return (
    <DashboardLayout pathname={pathname} showAlert={false} hideMenu>
      {showDomainSelection && (
        <SelectDomain onRegisterSuccess={handleSuccess} />
      )}
    </DashboardLayout>
  )
}
