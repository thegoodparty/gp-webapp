import { NextRequest, NextResponse } from 'next/server'
import { API_ROOT } from 'appEnv'

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
): Promise<NextResponse> => {
  const impersonateToken = req.cookies.get('impersonateToken')?.value
  const token = req.cookies.get('token')?.value

  if (impersonateToken || token) {
    req.headers.set('Authorization', `Bearer ${impersonateToken || token}`)
  }

  return NextResponse.rewrite(apiRewriteUrl(req.nextUrl), {
    request: req,
  })
}
