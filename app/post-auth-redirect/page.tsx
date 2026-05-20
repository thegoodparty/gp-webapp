'use client'

import { useEffect, useRef } from 'react'
import { useUser as useClerkUser } from '@clerk/nextjs'
import { clientRequest } from 'gpApi/typed-request'
import type { Organization } from 'gpApi/api-endpoints'
import {
  resolvePostAuthRedirectPath,
  CampaignStatus,
} from 'helpers/resolvePostAuthRedirectPath.util'
import { setCookie } from 'helpers/cookieHelper'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'
import { resolveSlug } from '@shared/hooks/useSelectedOrgSlug'
import { trackRegistrationCompleted } from 'helpers/analyticsHelper'
import { getReadyAnalytics } from '@shared/utils/analytics'
import { LoaderCircle } from 'lucide-react'

const PostAuthRedirectPage = () => {
  const { isSignedIn, isLoaded, user: clerkUser } = useClerkUser()
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    if (!isLoaded) return
    if (!isSignedIn) {
      window.location.replace('/login')
      return
    }

    ranRef.current = true
    ;(async () => {
      try {
        // First authenticated call after a fresh sign-up may race the gp-api
        // JIT-provisioning of the local user record. Retry once on failure
        // before falling back to an empty list.
        let organizations: Organization[] = []
        const orgsRes = await clientRequest(
          'GET /v1/organizations',
          {},
          { ignoreResponseError: true },
        )
        if (orgsRes.ok) {
          organizations = orgsRes.data.organizations
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const retry = await clientRequest(
            'GET /v1/organizations',
            {},
            { ignoreResponseError: true },
          )
          if (retry.ok) organizations = retry.data.organizations
        }

        const slug = resolveSlug(organizations)
        if (slug) {
          setCookie(ORG_SLUG_COOKIE, slug)
        }

        const [userRes, statusRes, electedRes] = await Promise.all([
          clientRequest('GET /v1/users/me', {}, { ignoreResponseError: true }),
          clientRequest(
            'GET /v1/campaigns/mine/status',
            {},
            { ignoreResponseError: true },
          ),
          clientRequest(
            'GET /v1/elected-office/current',
            {},
            { ignoreResponseError: true },
          ),
        ])

        const user = userRes.ok ? (userRes.data as { roles?: string[] }) : null
        const campaignStatus = statusRes.ok
          ? (statusRes.data as CampaignStatus)
          : null
        const hasElectedOffice = electedRes.ok

        // Fire the registration event only on a true fresh sign-up. The
        // ?source=signup hint set by <SignUp /> is just a re-fire guard for
        // back-to-back logout/login; the authoritative gate is the gp-api
        // user record's createdAt, which is server-set at JIT-provisioning
        // and cannot be forged by crafting a URL.
        const REGISTRATION_FRESHNESS_MS = 5 * 60 * 1000
        const sourceIsSignup =
          new URLSearchParams(window.location.search).get('source') === 'signup'
        if (userRes.ok && sourceIsSignup) {
          try {
            const userData = userRes.data as {
              id: number
              email?: string
              createdAt: string | Date
            }
            const createdAtMs = new Date(userData.createdAt).getTime()
            const isFreshlyCreated =
              Number.isFinite(createdAtMs) &&
              Date.now() - createdAtMs < REGISTRATION_FRESHNESS_MS
            if (isFreshlyCreated) {
              await trackRegistrationCompleted({
                analytics: getReadyAnalytics(),
                userId: String(userData.id),
                email:
                  userData.email ||
                  clerkUser?.primaryEmailAddress?.emailAddress ||
                  '',
              })
            }
          } catch (e) {
            console.error('registration tracking error', e)
          }
        }

        const path = resolvePostAuthRedirectPath(
          user,
          campaignStatus,
          hasElectedOffice,
        )
        // Hard nav so the destination renders with fresh auth'd server
        // state (PageWrapper re-runs with isAuthed=true and real orgs).
        window.location.replace(path)
      } catch (e) {
        console.error('post-auth-redirect error', e)
        // Don't strand new users on a blank /dashboard if the resolver
        // throws — onboarding is the safe default for unknown state.
        window.location.replace('/onboarding/office-selection')
      }
    })()
  }, [isSignedIn, isLoaded])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoaderCircle className="animate-spin" />
    </div>
  )
}

export default PostAuthRedirectPage
