'use client'

import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import { TCR_COMPLIANCE_STATUS } from 'app/(user)/profile/texting-compliance/components/ComplianceSteps'

interface ComplianceModalProps {
  open: boolean
  tcrComplianceStatus: string
  onClose: () => void
}

export function ComplianceModal({
  open,
  tcrComplianceStatus,
  onClose,
}: ComplianceModalProps): React.JSX.Element {
  let title: string,
    description: string,
    cta: string,
    ctaHref: string | undefined

  switch (tcrComplianceStatus) {
    case TCR_COMPLIANCE_STATUS.PENDING:
      title = 'Texting registration under review'
      description =
        'Your 10DLC registration is being reviewed and cannot send text messages yet. This typically takes 3-7 business days. We will email you once approved.'
      cta = 'Got it'
      ctaHref = undefined
      break
    case TCR_COMPLIANCE_STATUS.REJECTED:
      title = 'Texting registration needs attention'
      description =
        'Your 10DLC registration was rejected. Please contact our support team to resolve the issues and complete your registration.'
      cta = 'Contact Support'
      ctaHref = 'mailto:support@goodparty.org'
      break
    case TCR_COMPLIANCE_STATUS.ERROR:
      title = 'Registration error'
      description =
        'There was an error with your 10DLC registration. Please contact our support team for assistance.'
      cta = 'Contact Support'
      ctaHref = 'mailto:support@goodparty.org'
      break
    default:
      title = 'Complete texting registration'
      description =
        'To send text messages to voters, you need to complete 10DLC registration. This ensures compliance with carrier requirements and improves message delivery.'
      cta = 'Start Registration'
      ctaHref = '/profile#texting-compliance'
      break
  }

  return (
    <Modal
      open={open}
      closeCallback={onClose}
      preventBackdropClose
      preventEscClose
    >
      <div className="p-0 sm:p-2 md:p-8">
        <H1 className="m-0 sm:whitespace-nowrap">{title}</H1>
        <Body2 className="my-4">{description}</Body2>
        <div className="flex justify-between gap-4 mt-8">
          <Button size="large" color="neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button
            href={ctaHref}
            size="large"
            color="secondary"
            onClick={ctaHref ? undefined : onClose}
          >
            {cta}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
