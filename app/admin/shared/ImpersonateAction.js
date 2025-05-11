'use client'
import Button from '@shared/buttons/Button'
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
    <Button
      onClick={handleImpersonateUser}
      size="small"
      className="w-full font-semibold"
    >
      <span className="whitespace-nowrap">Impersonate</span>
    </Button>
  )
}
