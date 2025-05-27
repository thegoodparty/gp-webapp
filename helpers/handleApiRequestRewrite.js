import { NextResponse } from 'next/server'

import { API_ROOT } from 'appEnv'

const apiRootUrl = new URL(API_ROOT)

const apiRewriteUrl = (ReqNextUrl) => {
  const newUrl = ReqNextUrl.clone()
  newUrl.protocol = apiRootUrl.protocol
  newUrl.host = apiRootUrl.host
  newUrl.pathname = ReqNextUrl.pathname.replace('/api', '')
  newUrl.search = ReqNextUrl.search
  return newUrl.toString()
}

export const handleApiRequestRewrite = async (req) => {
  const { value: impersonateToken } =
    (await req.cookies.get('impersonateToken')) || {}
  const { value: token } = (await req.cookies.get('token')) || {}

  ;(impersonateToken || token) &&
    req.headers.set('Authorization', `Bearer ${impersonateToken || token}`)

  return NextResponse.rewrite(apiRewriteUrl(req.nextUrl), {
    request: req,
  })
}
