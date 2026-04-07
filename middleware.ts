import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { handleApiRequestRewrite } from 'helpers/handleApiRequestRewrite'
import { API_ROOT, API_VERSION_PREFIX } from 'appEnv'
import {
  resolvePostAuthRedirectPath,
  CampaignStatus,
} from 'helpers/resolvePostAuthRedirectPath.util'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/logout(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl
  // This is a workaround to pass the pathname to SSR pages
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)

  // Handle post-auth redirect in middleware (before page rendering)
  if (pathname === '/post-auth-redirect') {
    const { userId, getToken } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const token = await getToken()
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {}

    try {
      const [userRes, statusRes, electedOfficeRes] =
        await Promise.all([
          fetch(`${API_ROOT}${API_VERSION_PREFIX}/users/me`, {
            headers,
            cache: 'no-store',
          }),
          fetch(
            `${API_ROOT}${API_VERSION_PREFIX}/campaigns/mine/status`,
            { headers, cache: 'no-store' },
          ),
          fetch(
            `${API_ROOT}${API_VERSION_PREFIX}/elected-office/current`,
            { headers, cache: 'no-store' },
          ),
        ])

      const user = userRes.ok
        ? ((await userRes.json()) as { roles?: string[] })
        : null
      const campaignStatus = statusRes.ok
        ? ((await statusRes.json()) as CampaignStatus)
        : null
      const hasElectedOffice = electedOfficeRes.ok
      const redirectPath = resolvePostAuthRedirectPath(
        user,
        campaignStatus,
        hasElectedOffice,
      )

      return NextResponse.redirect(new URL(redirectPath, req.url))
    } catch (e) {
      console.error('post-auth-redirect middleware error', e)
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Handle API request rewrites
  const apiRewriteRequest = pathname.startsWith(`/api${API_VERSION_PREFIX}`)
  if (apiRewriteRequest) {
    try {
      const { getToken } = await auth()
      const token = await getToken()
      return await handleApiRequestRewrite(req, token)
    } catch (error) {
      console.error('Error in handleApiRequestRewrite', error)
      throw error
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?:on)?|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
