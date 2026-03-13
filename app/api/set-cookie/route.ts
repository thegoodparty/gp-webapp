import { setTokenCookie } from 'helpers/tokenCookie'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const { token } = await request.json()

  const response = NextResponse.json({ message: 'Cookie set' })
  return setTokenCookie(response, token)
}
