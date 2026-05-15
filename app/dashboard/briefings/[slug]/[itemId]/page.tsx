import { notFound } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import { getBriefingBySlug } from '@shared/briefings/server'
import AgendaItemCard from '../../components/detail/AgendaItemCard'

type PageProps = {
  params: Promise<{ slug: string; itemId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, itemId } = await params
  const briefing = await getBriefingBySlug(slug)
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
  const briefing = await getBriefingBySlug(slug)
  if (!briefing) notFound()
  const index = briefing.items.findIndex((i) => i.id === itemId)
  const item = briefing.items[index]
  if (!item) notFound()

  return (
    <AgendaItemCard
      item={item}
      itemIndex={index}
      sources={briefing.sources}
      domId={`briefing-item-${item.id}`}
      meetingDate={slug}
    />
  )
}
