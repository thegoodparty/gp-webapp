import { PaymentPortalButton } from '@shared/PaymentPortalButton'
import { MdOpenInNew } from 'react-icons/md'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import Link from 'next/link'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

interface AccountSettingsButtonProps {
  isPro: boolean
}

export const AccountSettingsButton = ({
  isPro,
}: AccountSettingsButtonProps): React.JSX.Element => {
  return isPro ? (
    <PaymentPortalButton>
      Manage Subscription
      <MdOpenInNew className="ml-2" />
    </PaymentPortalButton>
  ) : (
    <div>
      <Link
        className="underline"
        href="/dashboard/pro-sign-up"
        onClick={() => trackEvent(EVENTS.Settings.Account.ClickUpgrade)}
      >
        <PrimaryButton>Upgrade Plan</PrimaryButton>
      </Link>
    </div>
  )
}
