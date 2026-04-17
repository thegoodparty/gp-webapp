'use client'
import Button from '@shared/buttons/Button'
import { useImpersonateUser } from '@shared/hooks/useImpersonateUser'
import { useSnackbar } from 'helpers/useSnackbar'

interface ImpersonateActionProps {
  email: string
  isCandidate: boolean
  launched?: string
}

export default function ImpersonateAction({
  email,
  isCandidate,
  launched: launchStatus,
}: ImpersonateActionProps): React.JSX.Element {
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const { impersonate } = useImpersonateUser()

  const handleImpersonateUser = async () => {
    successSnackbar('Impersonating user')

    const token = await impersonate(email)
    if (token) {
      // Navigate to /impersonate to exchange the actor token for a Clerk session
      const redirectPath =
        isCandidate && launchStatus === 'Live' ? '/dashboard' : '/'
      window.location.href = `/impersonate?__clerk_ticket=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirectPath)}`
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
