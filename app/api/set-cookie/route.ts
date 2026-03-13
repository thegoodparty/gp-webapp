import { setTokenCookie } from 'helpers/tokenCookie'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

interface SetCookieBody {
  token: string
}

const parseBody = (req: NextRequest): Promise<SetCookieBody> => req.json()

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const { token } = await parseBody(request)

  const response = NextResponse.json({ message: 'Cookie set' })
  return setTokenCookie(response, token)
}
