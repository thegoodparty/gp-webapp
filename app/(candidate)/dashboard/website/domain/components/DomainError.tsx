import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import { DOMAIN_STATUS, PAYMENT_STATUS } from '../../util/domain.util'
import { useDomainStatus } from './DomainStatusProvider'
import DeleteDomain from './DeleteDomain'

export default function DomainError(): React.JSX.Element {
  const { status } = useDomainStatus()

  const { message, paymentStatus } = (status || {}) as { message?: string; paymentStatus?: string }

  return (
    <div className="max-w-2xl mx-auto mt-8 text-center">
      <H1>Domain Error</H1>
      <Body1 className="mt-4">
        There was an error registering your domain.
      </Body1>
      {message === DOMAIN_STATUS.NO_DOMAIN &&
        paymentStatus === PAYMENT_STATUS.SUCCEEDED && (
          <Body1 className="mt-4">
            Your payment was successful, but there was an error registering your
            domain. Please contact support.
          </Body1>
        )}
      {message === DOMAIN_STATUS.NO_DOMAIN &&
        paymentStatus === PAYMENT_STATUS.FAILED && (
          <>
            <Body1 className="my-4">
              Your payment failed. Please try again.
            </Body1>
            <DeleteDomain />
          </>
        )}
      {message === DOMAIN_STATUS.NO_DOMAIN &&
        paymentStatus === PAYMENT_STATUS.PROCESSING && (
          <Body1 className="mt-4">Your payment is processing.</Body1>
        )}
    </div>
  )
}

