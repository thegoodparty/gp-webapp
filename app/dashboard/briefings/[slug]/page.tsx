import { notFound } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import { getBriefingBySlug, isFullBriefing } from '@shared/briefings/server'
import {
  BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
  briefingItemDomId,
} from '@shared/briefings/routes'
import ExecutiveSummaryCard from '../components/detail/ExecutiveSummaryCard'
import AgendaItemCard from '../components/detail/AgendaItemCard'
import TrackBriefingViewed from '../components/TrackBriefingViewed'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const result = await getBriefingBySlug(slug)
  const briefing = result && isFullBriefing(result) ? result : null
  return pageMetaData({
    title: briefing
      ? `${briefing.title} | GoodParty.org`
      : 'Briefing | GoodParty.org',
    description: briefing?.executive_summary.lead_in ?? 'Meeting briefing',
    slug: `/dashboard/briefings/${slug}`,
  })
}

export const dynamic = 'force-dynamic'

/**
 * Briefing detail page.
 *
 * Renders the Executive Summary followed by every agenda item inline.
 * Featured items show the full card (talking points, recent news, budget,
 * sentiment, feedback); non-featured items render in the lightweight
 * "What to expect" variant. The sidebar TOC and mobile jump-to-section
 * sheet scroll within this page via hash anchors — no sub-routes.
 */
export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  const result = await getBriefingBySlug(slug)
  if (!result || !isFullBriefing(result)) notFound()
  const briefing = result

  return (
    <>
      <TrackBriefingViewed briefingId={slug} />
      <ExecutiveSummaryCard
        summary={briefing.executive_summary}
        agendaItemIds={briefing.items.map((item) => item.id)}
        domId={BRIEFING_EXECUTIVE_SUMMARY_DOM_ID}
      />

      {briefing.items.map((item, index) => {
        const isFeatured = item.tier === 'featured'
        return (
          <AgendaItemCard
            key={item.id}
            item={item}
            itemIndex={index}
            sources={briefing.sources}
            domId={briefingItemDomId(item.id)}
            meetingDate={slug}
            showFeedback={isFeatured}
            variant={isFeatured ? 'full' : 'whatToExpectOnly'}
          />
        )
      })}
    </>
  )
}
