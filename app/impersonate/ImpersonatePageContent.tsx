'use client'

import { useEffect, useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

export default function ImpersonatePageContent() {
  const { client, setActive, signOut, loaded } = useClerk()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const ticket = searchParams?.get('__clerk_ticket') ?? null

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
        router.refresh()
        router.push('/dashboard')
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[impersonate] Failed:', err)
        setError(msg)
      }
    }

    run()
  }, [loaded, ticket])

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
