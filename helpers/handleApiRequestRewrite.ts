import { NextRequest, NextResponse } from 'next/server'
import { API_ROOT } from 'appEnv'
import {
  ORG_SLUG_COOKIE,
  ORG_SLUG_HEADER,
} from '@shared/organizations/constants'

const apiRootUrl = new URL(API_ROOT)

const apiRewriteUrl = (reqNextUrl: URL): string => {
  const newUrl = new URL(reqNextUrl.toString())
  newUrl.protocol = apiRootUrl.protocol
  newUrl.hostname = apiRootUrl.hostname
  newUrl.pathname = reqNextUrl.pathname.replace('/api', '')
  newUrl.search = reqNextUrl.search
  newUrl.port = apiRootUrl.port

  return newUrl.toString()
}

export const handleApiRequestRewrite = async (
  req: NextRequest,
): Promise<NextResponse> => {
  const impersonateToken = req.cookies.get('impersonateToken')?.value
  const token = req.cookies.get('token')?.value

  if (impersonateToken || token) {
    req.headers.set('Authorization', `Bearer ${impersonateToken || token}`)
  }

  const orgSlug = req.cookies.get(ORG_SLUG_COOKIE)?.value
  if (orgSlug) {
    req.headers.set(ORG_SLUG_HEADER, orgSlug)
  }

  return NextResponse.rewrite(apiRewriteUrl(req.nextUrl), {
    request: req,
  })
}
