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

/**
 * Returns true when the organization is considered "active":
 * - Elected-office orgs are always active.
 * - Campaign orgs are active when their electionDate is today or in the future.
 * - Campaigns with no electionDate are treated as active (benefit of the doubt).
 */
const isActiveOrg = (org: Organization): boolean => {
  if (org.electedOfficeId) return true
  if (org.electionDate) {
    return org.electionDate >= new Date().toISOString().slice(0, 10)
  }
  return true
}

export const resolveSlug = (organizations: Organization[]): string | null => {
  const cookieSlug = getCookie(ORG_SLUG_COOKIE) || null
  const isValid = organizations.some((o) => o.slug === cookieSlug)
  if (isValid) return cookieSlug

  // Prefer active orgs (EO or future-election campaigns) over completed ones.
  const active = organizations.filter(isActiveOrg)
  const preferred = active.length > 0 ? active : organizations
  return preferred[0]?.slug ?? null
}
