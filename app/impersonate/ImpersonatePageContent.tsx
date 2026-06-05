'use client'

import { useEffect, useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

const isSafeReturnTo = (s: string | null): boolean => {
  if (typeof s !== 'string') return false
  if (!s.startsWith('/')) return false
  if (s.startsWith('//') || s.startsWith('/\\')) return false
  return s.startsWith('/dashboard/')
}

export default function ImpersonatePageContent() {
  const { client, setActive, signOut, loaded } = useClerk()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const ticket = searchParams?.get('__clerk_ticket') ?? null
  const returnTo = searchParams?.get('returnTo') ?? null
  const adminReturnTo = searchParams?.get('adminReturnTo') ?? null

  useEffect(() => {
    if (!loaded) return

    if (!ticket) {
      setError('No ticket provided in URL')
      return
    }

    async function run() {
      try {
        await signOut()

        const result = await client.signIn.create({
          strategy: 'ticket',
          ticket: ticket!,
        })

        if (result.status !== 'complete') {
          throw new Error(
            `Impersonation sign-in not complete (status: ${result.status})`,
          )
        }

        if (!result.createdSessionId) {
          throw new Error(
            `Impersonation did not create a session (status: ${result.status})`,
          )
        }

        await setActive({ session: result.createdSessionId })
        if (isSafeReturnTo(adminReturnTo)) {
          sessionStorage.setItem('gp_admin_return_to', adminReturnTo!)
        }
        window.location.href = isSafeReturnTo(returnTo)
          ? returnTo!
          : '/dashboard'
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[impersonate] Failed:', err)
        setError(msg)
      }
    }

    run()
  }, [loaded, ticket, returnTo, adminReturnTo])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600 font-semibold">Impersonation failed</p>
        <p className="text-sm text-gray-600 max-w-md text-center break-all">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Setting up impersonation session…</p>
    </div>
  )
}
