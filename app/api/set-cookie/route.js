import { setTokenCookie } from 'helpers/tokenCookie'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { token } = await request.json()

  const response = NextResponse.json({ message: 'Cookie set' })
  return setTokenCookie(response, token)
}
