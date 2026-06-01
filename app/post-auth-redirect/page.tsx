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
        // An explicit deep-link destination forwarded by the login flow when
        // the middleware bounced an unauthenticated deep link (e.g.
        // /dashboard/briefings from a marketing email). Only same-origin
        // relative paths are honored so this can't be an open redirect.
        const nextParam = new URLSearchParams(window.location.search).get(
          'next',
        )
        const safeNext =
          nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
            ? nextParam
            : null

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

        // The briefings / "serve" experience is scoped to the org that owns the
        // user's elected office (the gp-api elected-office + meetings endpoints
        // resolve by the X-Organization-Slug header). When the deep link points
        // there, select that org explicitly — otherwise `resolveSlug` falls
        // back to the first org and the briefings page can't find the elected
        // office, bouncing the user to /dashboard.
        const electedOrg = organizations.find((o) => o.electedOfficeId)
        const wantsServe =
          !!safeNext && safeNext.startsWith('/dashboard/briefings')
        const slug =
          wantsServe && electedOrg
            ? electedOrg.slug
            : resolveSlug(organizations)
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

        const resolvedPath = resolvePostAuthRedirectPath(
          user,
          campaignStatus,
          hasElectedOffice,
        )
        // Honor the explicit deep-link destination now that the org slug cookie
        // is set and the session is established.
        // Hard nav so the destination renders with fresh auth'd server
        // state (PageWrapper re-runs with isAuthed=true and real orgs).
        window.location.replace(safeNext ?? resolvedPath)
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
