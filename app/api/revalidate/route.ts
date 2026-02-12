import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path, 'page')
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
