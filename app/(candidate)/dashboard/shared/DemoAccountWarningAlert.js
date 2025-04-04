import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner'
import { DemoAccountDeleteDialog } from '@shared/utils/DemoAccountDeleteDialog'
import { handleDemoAccountDeletion } from '@shared/utils/handleDemoAccountDeletion'
import { useSnackbar } from 'helpers/useSnackbar'

export const DemoAccountWarningAlert = () => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const { errorSnackbar } = useSnackbar()

  const handleDemoAlertButtonOnClick = () => {
    setShowModal(true)
  }

  return (
    <>
      <AlertBanner
        title="Demo Account Notice"
        message="Updates made in your demo account are not stored. Upgrade now to prevent data loss."
        actionOnClick={handleDemoAlertButtonOnClick}
        actionText="Upgrade"
        severity="warning"
      />
      <DemoAccountDeleteDialog
        open={showModal}
        handleClose={() => setShowModal(false)}
        handleProceed={handleDemoAccountDeletion(errorSnackbar, router)}
      />
    </>
  )
}
