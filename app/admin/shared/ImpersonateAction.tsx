'use client'
import { useClerk, useSignIn } from '@clerk/nextjs'
import Button from '@shared/buttons/Button'
import { clientRequest } from 'gpApi/typed-request'
import { useSnackbar } from 'helpers/useSnackbar'

interface ImpersonateActionProps {
  userId: number
}

export default function ImpersonateAction({
  userId,
}: ImpersonateActionProps): React.JSX.Element {
  const { signIn, fetchStatus } = useSignIn()
  const { setActive } = useClerk()
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const handleImpersonate = async () => {
    if (fetchStatus === 'fetching') return
    try {
      successSnackbar('Impersonating user...')
      const resp = await clientRequest(
        'POST /v1/admin/users/impersonate/:userId',
        { userId: String(userId) },
      )
      if (!resp.ok || !resp.data.token) {
        errorSnackbar('Failed to get impersonation token')
        return
      }
      const { error } = await signIn.create({ ticket: resp.data.token })
      if (!error && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId })
        window.location.href = '/dashboard'
      } else {
        errorSnackbar('Impersonation failed')
      }
    } catch (e) {
      console.error('Impersonation error', e)
      errorSnackbar('Impersonation failed')
    }
  }

  return (
    <Button
      onClick={handleImpersonate}
      size="small"
      className="w-full font-semibold"
    >
      <span className="whitespace-nowrap">Impersonate</span>
    </Button>
  )
}
