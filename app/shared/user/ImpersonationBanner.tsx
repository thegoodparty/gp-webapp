'use client'

import { useClerk } from '@clerk/nextjs'
import { useIsImpersonating } from '@shared/hooks/useIsImpersonating'
import { useUser } from '@shared/hooks/useUser'

const GP_ADMIN_URL = process.env.NEXT_PUBLIC_GP_ADMIN_URL ?? '/'

export default function ImpersonationBanner() {
  const isImpersonating = useIsImpersonating()
  const { signOut } = useClerk()
  const [user] = useUser()

  if (!isImpersonating) return null

  async function handleStopImpersonating() {
    await signOut()
    window.location.href = GP_ADMIN_URL
  }

  return (
    <div className="bg-amber-400 text-black px-4 py-1 text-center text-xs font-medium">
      You are impersonating {user?.email ?? 'this user'}.{' '}
      <button
        onClick={handleStopImpersonating}
        className="bg-black text-white border-none rounded px-3 py-1 cursor-pointer ml-2 text-[13px]"
      >
        Stop Impersonating
      </button>
    </div>
  )
}
