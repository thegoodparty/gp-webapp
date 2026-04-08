'use client'
import { useSignIn } from '@clerk/nextjs'
import Button from '@shared/buttons/Button'
import { clientRequest } from 'gpApi/typed-request'
import { useSnackbar } from 'helpers/useSnackbar'

interface ImpersonateActionProps {
  userId: number
}

export default function ImpersonateAction({
  userId,
}: ImpersonateActionProps): React.JSX.Element {
  const { signIn, isLoaded, setActive } = useSignIn()
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const handleImpersonate = async () => {
    if (!isLoaded) return
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
      const result = await signIn.create({
        strategy: 'ticket',
        ticket: resp.data.token,
      })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        window.location.href = '/dashboard'
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
