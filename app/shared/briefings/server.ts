import { cache } from 'react'
import { briefingsBySlug } from './fixtures'
import type { Briefing } from './types'

/**
 * Resolve a briefing by slug.
 *
 * Wrapped in `cache()` so a layout and its nested page can both call this
 * within a single request without duplicating work. Returns null if the
 * briefing does not exist.
 *
 * TODO: replace fixture lookup with Swain's BriefingsApi once available.
 */
export const getBriefingBySlug = cache(
  async (slug: string): Promise<Briefing | null> => {
    return briefingsBySlug[slug] ?? null
  },
)
