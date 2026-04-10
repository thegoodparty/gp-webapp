'use client'

import { useAuth, useClerk } from '@clerk/nextjs'

const GP_ADMIN_URL = process.env.NEXT_PUBLIC_GP_ADMIN_URL ?? '/'

export default function ImpersonationBanner() {
  const { actor } = useAuth()
  const { signOut } = useClerk()

  if (!actor) return null

  async function handleStopImpersonating() {
    await signOut()
    window.location.href = GP_ADMIN_URL
  }

  return (
    <div className="sticky top-0 z-[9999] bg-amber-400 text-black px-4 py-2 text-center text-sm font-medium">
      You are impersonating this user.{' '}
      <button
        onClick={handleStopImpersonating}
        className="bg-black text-white border-none rounded px-3 py-1 cursor-pointer ml-2 text-[13px]"
      >
        Stop Impersonating
      </button>
    </div>
  )
}
