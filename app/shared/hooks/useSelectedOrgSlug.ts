'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getCookie } from 'helpers/cookieHelper'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'
import { Organization } from 'gpApi/api-endpoints'
import { ORGANIZATIONS_QUERY_KEY } from '@shared/organization-picker'

// After a fresh login, the first SSR pass renders with the user's real
// organizations (passed as initialOrganizations from the server), but
// React Query's client-side cache may still hold stale data from the
// prior unauthenticated session (an empty array). This hook keeps the
// cache and selected slug in sync with the latest server-provided
// organizations so the provider never serves stale/empty state.
export const useSelectedOrgSlug = (initialOrganizations: Organization[]) => {
  const queryClient = useQueryClient()
  const [selectedSlug, setSelectedSlug] = useState(() =>
    resolveSlug(initialOrganizations),
  )

  useEffect(() => {
    if (initialOrganizations.length === 0) return
    queryClient.setQueryData(ORGANIZATIONS_QUERY_KEY, initialOrganizations)
    setSelectedSlug((prev) => {
      if (prev) {
        const stillValid = initialOrganizations.some((o) => o.slug === prev)
        if (stillValid) return prev
      }
      return resolveSlug(initialOrganizations)
    })
  }, [initialOrganizations, queryClient])

  return [selectedSlug, setSelectedSlug] as const
}

export const resolveSlug = (organizations: Organization[]): string | null => {
  const cookieSlug = getCookie(ORG_SLUG_COOKIE) || null
  const isValid = organizations.some((o) => o.slug === cookieSlug)
  return isValid ? cookieSlug : organizations[0]?.slug ?? null
}
