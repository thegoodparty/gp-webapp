'use client'

import Modal from '@shared/utils/Modal'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import PaymentForm from '../../editor/components/PaymentForm'

interface DomainPurchaseModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  onError: (error: Error) => void
  domainName: string
  price: number
  clientSecret: string
}

export default function DomainPurchaseModal({
  open,
  onClose,
  onSuccess,
  onError,
  domainName,
  price,
  clientSecret,
}: DomainPurchaseModalProps): React.JSX.Element {
  return (
    <Modal open={open} closeCallback={onClose}>
      <div className="w-[90vw] max-w-md">
        <H2 className="mb-4">Purchase Domain</H2>
        <Body2 className="mb-6">
          Complete your purchase to register {domainName}
        </Body2>

        <PaymentForm
          clientSecret={clientSecret}
          domainName={domainName}
          price={price}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </Modal>
  )
}
