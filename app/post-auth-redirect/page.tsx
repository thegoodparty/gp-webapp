'use client'

import { useEffect, useRef } from 'react'
import { useUser as useClerkUser } from '@clerk/nextjs'
import { clientRequest } from 'gpApi/typed-request'
import {
  resolvePostAuthRedirectPath,
  CampaignStatus,
} from 'helpers/resolvePostAuthRedirectPath.util'
import { setCookie } from 'helpers/cookieHelper'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'
import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import { resolveSlug } from '@shared/hooks/useSelectedOrgSlug'

const PostAuthRedirectPage = () => {
  const { isSignedIn, isLoaded } = useClerkUser()
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
        const {
          data: { organizations },
        } = await clientRequest('GET /v1/organizations', {})

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
        window.location.replace('/dashboard')
      }
    })()
  }, [isSignedIn, isLoaded])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingAnimation />
    </div>
  )
}

export default PostAuthRedirectPage
