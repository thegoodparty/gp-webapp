'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsImpersonating } from '@shared/hooks/useIsImpersonating'
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
  const isImpersonating = useIsImpersonating()
  const router = useRouter()

  useEffect(() => {
    if (!isImpersonating) {
      router.replace(briefingOverviewHref(slug))
    }
  }, [isImpersonating, router, slug])

  if (!isImpersonating) return null

  return <>{children}</>
}
