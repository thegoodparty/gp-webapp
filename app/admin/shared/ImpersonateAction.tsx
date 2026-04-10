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
      console.log('[impersonate] starting for userId:', userId)
      successSnackbar('Impersonating user...')
      const resp = await clientRequest(
        'POST /v1/admin/users/impersonate/:userId',
        { userId: String(userId) },
      )
      console.log('[impersonate] token response:', { ok: resp.ok, hasToken: !!resp.data?.token })
      if (!resp.ok || !resp.data.token) {
        errorSnackbar('Failed to get impersonation token')
        return
      }
      console.log('[impersonate] signing out current session')
      await signOut()
      console.log('[impersonate] creating ticket session')
      const result = await client.signIn.create({
        strategy: 'ticket',
        ticket: resp.data.token,
      })
      console.log('[impersonate] signIn.create result:', { status: result.status, createdSessionId: result.createdSessionId })
      if (!result.createdSessionId) {
        errorSnackbar('Impersonation failed')
        return
      }
      console.log('[impersonate] setting active session')
      await setActive({ session: result.createdSessionId })
      console.log('[impersonate] navigating to /dashboard')
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
