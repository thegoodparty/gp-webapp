'use client'
import { useClerk } from '@clerk/nextjs'
import Button from '@shared/buttons/Button'
import { clientRequest } from 'gpApi/typed-request'
import { useSnackbar } from 'helpers/useSnackbar'

interface ImpersonateActionProps {
  userId: number
}

export default function ImpersonateAction({
  userId,
}: ImpersonateActionProps): React.JSX.Element {
  const { client, setActive, signOut } = useClerk()
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const handleImpersonate = async () => {
    try {
      const resp = await clientRequest(
        'POST /v1/admin/users/impersonate/:userId',
        { userId: String(userId) },
      )
      if (!resp.ok || !resp.data.token) {
        errorSnackbar('Failed to get impersonation token')
        return
      }
      await signOut()
      const result = await client.signIn.create({
        strategy: 'ticket',
        ticket: resp.data.token,
      })
      if (result.status !== 'complete') {
        errorSnackbar('Impersonation failed')
        return
      }
      if (!result.createdSessionId) {
        errorSnackbar('Impersonation failed')
        return
      }
      await setActive({ session: result.createdSessionId })
      successSnackbar('Impersonating user...')
      window.location.assign('/dashboard')
    } catch (e) {
      console.error('[impersonate] error:', e)
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
