'use client'

import { useEffect, useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

const isSafeRelativePath = (s: string | null): s is string => {
  if (typeof s !== 'string') return false
  if (!s.startsWith('/')) return false
  // Block protocol-relative ("//host") and backslash ("/\host") open redirects.
  return !(s.startsWith('//') || s.startsWith('/\\'))
}

// returnTo is a gp-webapp path, so restrict it to the dashboard.
const isSafeReturnTo = (s: string | null): s is string =>
  isSafeRelativePath(s) && s.startsWith('/dashboard/')

// adminReturnTo is a gp-admin portal path (handed to GP_ADMIN_URL on stop), so
// it must NOT be held to gp-webapp's /dashboard/ allowlist — any safe relative
// path is valid there.
const isSafeAdminReturnTo = (s: string | null): s is string =>
  isSafeRelativePath(s)

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
        if (isSafeAdminReturnTo(adminReturnTo)) {
          sessionStorage.setItem('gp_admin_return_to', adminReturnTo)
        }
        window.location.href = isSafeReturnTo(returnTo)
          ? returnTo
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
