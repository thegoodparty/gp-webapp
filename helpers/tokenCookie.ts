import { NextResponse } from 'next/server'

interface TokenConfig {
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax' | 'strict' | 'none'
}

const TOKEN_CONFIG: TokenConfig = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
}

export const setTokenCookie = (
  resp: NextResponse,
  token: string,
): NextResponse => {
  const expires = new Date()
  expires.setTime(expires.getTime() + 120 * 24 * 60 * 60 * 1000)
  resp.cookies.set('token', token, {
    ...TOKEN_CONFIG,
    expires,
  })
  return resp
}

export const deleteTokenCookie = (resp: NextResponse): NextResponse => {
  resp.cookies.set('token', '', {
    ...TOKEN_CONFIG,
    expires: new Date(0),
  })
  resp.cookies.set('impersonateToken', '', {
    ...TOKEN_CONFIG,
    expires: new Date(0),
  })
  return resp
}
