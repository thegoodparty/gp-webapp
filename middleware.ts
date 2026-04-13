import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { handleApiRequestRewrite } from 'helpers/handleApiRequestRewrite'
import { API_VERSION_PREFIX } from 'appEnv'

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
