'use client'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { useImpersonateUser } from '@shared/hooks/useImpersonateUser'
import { useSnackbar } from 'helpers/useSnackbar'

export default function ImpersonateAction({
  email,
  isCandidate,
  launched: launchStatus,
}) {
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const { impersonate } = useImpersonateUser()

  const handleImpersonateUser = async () => {
    successSnackbar('Impersonating user')

    const impersonateResp = await impersonate(email)
    if (impersonateResp) {
      if (isCandidate && launchStatus === 'Live') {
        window.location.href = `/dashboard`
      } else {
        window.location.href = '/'
      }
    } else {
      errorSnackbar('Impersonate failed')
    }
  }

  return (
    <div className="my-3">
      <PrimaryButton onClick={handleImpersonateUser} size="small" fullWidth>
        <span className="whitespace-nowrap">Impersonate</span>
      </PrimaryButton>
    </div>
  )
}
