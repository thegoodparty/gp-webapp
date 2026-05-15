import { NextResponse } from 'next/server'
import { briefingsLandingFixture } from '@shared/briefings/fixtures'

/**
 * Dev-only stub for Swain's BriefingsApi list endpoint.
 *
 * Returns the same shape Swain's production endpoint will return so the FE
 * can fetch through the same client interface during development.
 *
 * NEXT_PUBLIC_APP_BASE=http://localhost:4000
 *   GET /api/dev/briefings -> BriefingSummary[]
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'dev_only' }, { status: 404 })
  }
  return NextResponse.json(briefingsLandingFixture)
}
