import { NextResponse } from 'next/server'
import { deleteTokenCookie } from 'helpers/tokenCookie'

export const DELETE = async (): Promise<NextResponse> =>
  deleteTokenCookie(NextResponse.json({ message: 'deleted' }, { status: 200 }))
