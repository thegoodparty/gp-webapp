import { redirect } from 'next/navigation'
import {
  briefingItemDomId,
  briefingOverviewHref,
} from '@shared/briefings/routes'

type PageProps = {
  params: Promise<{ slug: string; itemId: string }>
}

export const dynamic = 'force-dynamic'

/**
 * Legacy per-item route. All agenda items now render inline on the
 * briefing overview page; this route redirects deep links to the matching
 * hash anchor so existing bookmarks and PDF cross-references keep
 * working.
 */
export default async function Page({
  params,
}: PageProps): Promise<never> {
  const { slug, itemId } = await params
  redirect(`${briefingOverviewHref(slug)}#${briefingItemDomId(itemId)}`)
}
