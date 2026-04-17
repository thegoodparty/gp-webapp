import { NextRequest, NextResponse } from 'next/server'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'

/**
 * Sets the organization-slug cookie and redirects to the given path.
 *
 * This is used by serveAccess() to auto-switch the user to their elected-office
 * org when they navigate to an EO URL (e.g. /dashboard/briefings) while their
 * cookie still points to a campaign org.
 *
 * Because Next.js Server Components cannot set cookies, we bounce through this
 * Route Handler which CAN set cookies on the response.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  const redirectPath =
    request.nextUrl.searchParams.get('redirect') || '/dashboard'

  if (!slug) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const destination = new URL(redirectPath, request.url)

  const response = NextResponse.redirect(destination)
  response.cookies.set(ORG_SLUG_COOKIE, slug, {
    path: '/',
    maxAge: 120 * 24 * 60 * 60, // 120 days, matching cookieHelper.setCookie
    sameSite: 'lax',
  })

  return response
}
