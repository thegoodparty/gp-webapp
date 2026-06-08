import { notFound } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import { getBriefingBySlug, isFullBriefing } from '@shared/briefings/server'
import {
  BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
  briefingItemDomId,
} from '@shared/briefings/routes'
import ExecutiveSummaryCard from '../../../briefings/components/detail/ExecutiveSummaryCard'
import AgendaItemCard from '../../../briefings/components/detail/AgendaItemCard'
import TrackBriefingViewed from '../../../briefings/components/TrackBriefingViewed'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const result = await getBriefingBySlug(slug)
  const briefing = result && isFullBriefing(result) ? result : null
  return pageMetaData({
    title: briefing
      ? `${briefing.title} (review) | GoodParty.org`
      : 'Briefing review | GoodParty.org',
    description: briefing?.executive_summary.lead_in ?? 'Meeting briefing',
    slug: `/dashboard/admin-review/briefings/${slug}`,
  })
}

export const dynamic = 'force-dynamic'

/**
 * Admin-review briefing detail page. Reuses the candidate-facing page body
 * verbatim — the cards are mode-agnostic and read whatever AnnotationsCtx
 * the layout provides (ReviewAnnotationsScope in this tree).
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
