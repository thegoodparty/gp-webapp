import { notFound } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import { getBriefingBySlug, isFullBriefing } from '@shared/briefings/server'
import AgendaItemCard from '../../components/detail/AgendaItemCard'

type PageProps = {
  params: Promise<{ slug: string; itemId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, itemId } = await params
  const result = await getBriefingBySlug(slug)
  const briefing = result && isFullBriefing(result) ? result : null
  const item = briefing?.items.find((i) => i.id === itemId)
  return pageMetaData({
    title:
      briefing && item
        ? `${item.title} · ${briefing.title} | GoodParty.org`
        : 'Briefing | GoodParty.org',
    description: item?.display.summary ?? 'Meeting briefing',
    slug: `/dashboard/briefings/${slug}/${itemId}`,
  })
}

export const dynamic = 'force-dynamic'

/**
 * Per-item briefing page. Every item has its own route so the TOC
 * navigates rather than scrolls.
 */
export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { slug, itemId } = await params
  const result = await getBriefingBySlug(slug)
  if (!result || !isFullBriefing(result)) notFound()
  const briefing = result
  const index = briefing.items.findIndex((i) => i.id === itemId)
  const item = briefing.items[index]
  if (!item) notFound()

  return (
    <AgendaItemCard
      item={item}
      itemIndex={index}
      sources={briefing.sources}
      domId={`briefing-item-${item.id}`}
      showFeedback={item.tier === 'featured'}
    />
  )
}
