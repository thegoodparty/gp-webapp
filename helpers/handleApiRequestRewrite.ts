import { NextRequest, NextResponse } from 'next/server'
import { API_ROOT } from 'appEnv'
import {
  ORG_SLUG_COOKIE,
  ORG_SLUG_HEADER,
} from '@shared/organizations/constants'

const apiRootUrl = new URL(API_ROOT)

const apiRewriteUrl = (ReqNextUrl: URL): string => {
  const newUrl = new URL(ReqNextUrl.toString())
  newUrl.protocol = apiRootUrl.protocol
  newUrl.hostname = apiRootUrl.hostname
  newUrl.pathname = ReqNextUrl.pathname.replace('/api', '')
  newUrl.search = ReqNextUrl.search
  newUrl.port = apiRootUrl.port

  return newUrl.toString()
}

export const handleApiRequestRewrite = async (
  req: NextRequest,
  clerkToken: string | null,
): Promise<NextResponse> => {
  if (clerkToken) {
    req.headers.set('Authorization', `Bearer ${clerkToken}`)
  }

  const orgSlug = req.cookies.get(ORG_SLUG_COOKIE)?.value
  if (orgSlug) {
    req.headers.set(ORG_SLUG_HEADER, orgSlug)
  }

  return NextResponse.rewrite(apiRewriteUrl(req.nextUrl), {
    request: req,
  })
}
