import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PaymentPortalButton } from '@shared/PaymentPortalButton'
import { MdOpenInNew } from 'react-icons/md'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { DemoAccountDeleteDialog } from '@shared/utils/DemoAccountDeleteDialog'
import { handleDemoAccountDeletion } from '@shared/utils/handleDemoAccountDeletion'
import Link from 'next/link'
import { useSnackbar } from 'helpers/useSnackbar'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

export const AccountSettingsButton = ({ isPro, isDemo }) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const { errorSnackbar } = useSnackbar()

  return isPro ? (
    <PaymentPortalButton>
      Manage Subscription
      <MdOpenInNew className="ml-2" />
    </PaymentPortalButton>
  ) : isDemo ? (
    <>
      <PrimaryButton onClick={() => setShowModal(true)}>
        Change Plan
      </PrimaryButton>
      <DemoAccountDeleteDialog
        open={showModal}
        handleClose={() => setShowModal(false)}
        handleProceed={handleDemoAccountDeletion(errorSnackbar, router)}
      />
    </>
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
