import { redirect } from 'next/navigation'
import { briefingItemDomId } from '@shared/briefings/routes'

type PageProps = {
  params: Promise<{ slug: string; itemId: string }>
}

export const dynamic = 'force-dynamic'

/**
 * Legacy per-item route for the admin-review tree. All agenda items render
 * inline on the review overview page; this redirects deep links to the
 * matching hash anchor on that page.
 */
export default async function Page({ params }: PageProps): Promise<never> {
  const { slug, itemId } = await params
  redirect(
    `/dashboard/admin-review/briefings/${slug}#${briefingItemDomId(itemId)}`,
  )
}
