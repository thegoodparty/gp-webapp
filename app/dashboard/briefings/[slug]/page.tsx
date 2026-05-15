import { notFound } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import { getBriefingBySlug } from '@shared/briefings/server'
import { renderBriefingForSpeech } from '@shared/briefings/renderForSpeech'
import ExecutiveSummaryCard from '../components/detail/ExecutiveSummaryCard'
import AgendaItemCard from '../components/detail/AgendaItemCard'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const briefing = await getBriefingBySlug(slug)
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
  const briefing = await getBriefingBySlug(slug)
  if (!briefing) notFound()

  // Pre-render the briefing into a single plain-text blob for the speech
  // service. Doing this here (rather than in the button) keeps the speech
  // module a pure pipe: it accepts text and returns audio, with zero
  // briefing-schema knowledge.
  const speechText = renderBriefingForSpeech(briefing)

  return (
    <>
      <ExecutiveSummaryCard
        summary={briefing.executiveSummary}
        domId={EXECUTIVE_SUMMARY_DOM_ID}
        speechText={speechText}
        analyticsLabel="briefing"
      />

      {briefing.actionItems.map((item, i) => (
        <AgendaItemCard
          key={item.id}
          item={item}
          index={i}
          domId={`briefing-${briefing.id}-item-${item.id}`}
        />
      ))}
    </>
  )
}
