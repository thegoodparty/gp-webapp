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
//
// The initial slug must be sourced from the server (via next/headers) and
// passed in: useState initializers can't read document.cookie during SSR,
// so resolving the cookie client-side only would briefly render the
// fallback org on the server and then mismatch on hydration.
export const useSelectedOrgSlug = (
  initialOrganizations: Organization[],
  initialSlug: string | null,
) => {
  const queryClient = useQueryClient()
  const [selectedSlug, setSelectedSlug] = useState(() =>
    pickSlug(
      initialOrganizations,
      (initialSlug ?? getCookie(ORG_SLUG_COOKIE)) || null,
    ),
  )

  useEffect(() => {
    if (initialOrganizations.length === 0) return
    queryClient.setQueryData(ORGANIZATIONS_QUERY_KEY, initialOrganizations)
    setSelectedSlug((prev) => {
      if (prev) {
        const stillValid = initialOrganizations.some((o) => o.slug === prev)
        if (stillValid) return prev
      }
      return pickSlug(
        initialOrganizations,
        (initialSlug ?? getCookie(ORG_SLUG_COOKIE)) || null,
      )
    })
  }, [initialOrganizations, initialSlug, queryClient])

  return [selectedSlug, setSelectedSlug] as const
}

const pickSlug = (
  organizations: Organization[],
  candidate: string | null | false,
): string | null => {
  const isValid = candidate && organizations.some((o) => o.slug === candidate)
  return isValid ? (candidate as string) : (organizations[0]?.slug ?? null)
}

export const resolveSlug = (organizations: Organization[]): string | null =>
  pickSlug(organizations, getCookie(ORG_SLUG_COOKIE) || null)
