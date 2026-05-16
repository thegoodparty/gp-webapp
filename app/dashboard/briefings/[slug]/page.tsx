import { notFound } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import { getBriefingBySlug, isFullBriefing } from '@shared/briefings/server'
import { renderBriefingForSpeech } from '@shared/briefings/renderForSpeech'
import ExecutiveSummaryCard from '../components/detail/ExecutiveSummaryCard'
import AgendaItemCard from '../components/detail/AgendaItemCard'

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
    description: briefing?.executiveSummary ?? 'Meeting briefing',
    slug: `/dashboard/briefings/${slug}`,
  })
}

export const dynamic = 'force-dynamic'

const EXECUTIVE_SUMMARY_DOM_ID = 'briefing-executive-summary'

/**
 * Briefing overview page.
 *
 * Renders the Executive Summary plus the top issues (action items) inline
 * so the user can scan the priorities at a glance. Non-action items (Call
 * to order, Public comment period, etc.) have their own per-item pages
 * reached via the sidebar TOC.
 */
export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  const result = await getBriefingBySlug(slug)
  if (!result || !isFullBriefing(result)) notFound()
  const briefing = result

  // Pre-render the briefing into a single plain-text blob for the speech
  // service. Doing this here (rather than in the button) keeps the speech
  // module a pure pipe: it accepts text and returns audio, with zero
  // briefing-schema knowledge.
  const speechText = renderBriefingForSpeech(briefing)

  const featuredItems = briefing.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.tier === 'featured')

  return (
    <>
      <ExecutiveSummaryCard
        summary={briefing.executiveSummary}
        domId={EXECUTIVE_SUMMARY_DOM_ID}
        speechText={speechText}
        analyticsLabel="briefing"
      />

      {featuredItems.map(({ item, index }) => (
        <AgendaItemCard
          key={item.id}
          item={item}
          itemIndex={index}
          sources={briefing.sources}
          domId={`briefing-item-${item.id}`}
          meetingDate={slug}
          showFeedback
        />
      ))}
    </>
  )
}
