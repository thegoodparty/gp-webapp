import { notFound } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import { getBriefingBySlug } from '@shared/briefings/server'
import AgendaItemCard from '../../components/detail/AgendaItemCard'
import SlimAgendaCard from '../../components/detail/SlimAgendaCard'

type PageProps = {
  params: Promise<{ slug: string; itemId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, itemId } = await params
  const briefing = await getBriefingBySlug(slug)
  const agendaItem = briefing?.agenda.find((a) => a.id === itemId)
  return pageMetaData({
    title:
      briefing && agendaItem
        ? `${agendaItem.title} · ${briefing.title} | GoodParty.org`
        : 'Briefing | GoodParty.org',
    description: agendaItem?.whatToExpect ?? 'Meeting briefing',
    slug: `/dashboard/briefings/${slug}/${itemId}`,
  })
}

export const dynamic = 'force-dynamic'

/**
 * Per-agenda-item page. Every agenda item has its own route so the TOC
 * navigates rather than scrolls.
 *
 *   - Action items render the full AgendaItemCard with all sections.
 *   - Other items (procedural, consent, public input, informational) render
 *     the SlimAgendaCard with title and (when available) "What to expect".
 */
export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { slug, itemId } = await params
  const briefing = await getBriefingBySlug(slug)
  if (!briefing) notFound()
  const agendaItem = briefing.agenda.find((a) => a.id === itemId)
  if (!agendaItem) notFound()

  const action = briefing.actionItems.find((a) => a.id === itemId)
  const domId = `briefing-${briefing.id}-item-${itemId}`

  if (action) {
    const index = briefing.actionItems.findIndex((a) => a.id === itemId)
    return <AgendaItemCard item={action} index={index} domId={domId} />
  }

  const agendaIndex = briefing.agenda.findIndex((a) => a.id === itemId)
  return (
    <SlimAgendaCard item={agendaItem} domId={domId} agendaIndex={agendaIndex} />
  )
}
