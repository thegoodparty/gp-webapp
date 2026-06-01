import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { handleApiRequestRewrite } from 'helpers/handleApiRequestRewrite'
import { API_VERSION_PREFIX } from 'appEnv'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/logout(.*)',
  '/sign-up(.*)',
  '/impersonate(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname, search } = req.nextUrl
  // This is a workaround to pass the pathname to SSR pages. `x-search` carries
  // the query string separately so server components (e.g. serveAccess) can
  // reconstruct the full requested URL without changing the `x-pathname`
  // semantics other consumers rely on.
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)
  requestHeaders.set('x-search', search)

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
    const { userId } = await auth()
    if (!userId) {
      // Redirect unauthenticated users to the sign-in page explicitly instead
      // of relying on `auth.protect()`. When Clerk can't resolve the sign-in
      // URL on the server it responds with a 404 rather than redirecting (see
      // clerk/javascript#8302), which breaks deep links like
      // `/dashboard/briefings` shared in marketing emails. Preserving the
      // original path in `redirect_url` lets `<SignIn>` route the user back to
      // the requested page after they log in.
      const signInUrl = new URL('/login', req.url)
      signInUrl.searchParams.set(
        'redirect_url',
        `${req.nextUrl.pathname}${req.nextUrl.search}`,
      )
      return NextResponse.redirect(signInUrl)
    }
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
