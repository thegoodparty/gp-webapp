import { NextResponse } from 'next/server'
import { briefingsBySlug } from '@shared/briefings/fixtures'

type RouteParams = {
  params: Promise<{ slug: string }>
}

/**
 * Dev-only stub for Swain's BriefingsApi detail endpoint.
 *
 *   GET /api/dev/briefings/:slug -> Briefing | 404
 */
export async function GET(
  _request: Request,
  { params }: RouteParams,
): Promise<NextResponse> {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'dev_only' }, { status: 404 })
  }
  const { slug } = await params
  const briefing = briefingsBySlug[slug]
  if (!briefing) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  return NextResponse.json(briefing)
}
