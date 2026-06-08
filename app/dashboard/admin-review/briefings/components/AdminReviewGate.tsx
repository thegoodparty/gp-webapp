'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { briefingOverviewHref } from '@shared/briefings/routes'

type Props = {
  slug: string
  children: React.ReactNode
}

/**
 * Client gate for the admin-review route tree. Review mode only makes sense
 * while a staff member is impersonating a candidate (the reviewer is acting
 * inside the candidate's session). If not impersonating, bounce to the
 * normal candidate-facing briefing and render nothing.
 */
export default function AdminReviewGate({
  slug,
  children,
}: Props): React.JSX.Element | null {
  const { actor, isLoaded } = useAuth()
  const router = useRouter()
  const isImpersonating = !!actor

  useEffect(() => {
    // Wait for Clerk to finish loading before deciding — `actor` is undefined
    // until then, so redirecting eagerly would bounce a legitimate
    // impersonation session off the page on first paint.
    if (isLoaded && !isImpersonating) {
      router.replace(briefingOverviewHref(slug))
    }
  }, [isLoaded, isImpersonating, router, slug])

  if (!isLoaded || !isImpersonating) return null

  return <>{children}</>
}
