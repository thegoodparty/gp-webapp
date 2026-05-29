import type { Briefing, Item } from './types'
import { formatBriefingMeetingDate } from './dateHelpers'

/**
 * Render a briefing into a single, sentence-friendly plain-text blob
 * suitable for the speech service to synthesize.
 *
 * The goal is a hands-free read of the whole page: we walk the briefing
 * top to bottom in the same order the detail page renders it — the
 * meeting header line, the executive summary, then every agenda item with
 * its section headers ("What to expect", "Budget impact", etc.) — so the
 * audio matches what the reader sees on screen.
 *
 * Why this lives in the frontend, not the speech module:
 *   The speech module is a pure pipe (text → audio). Each caller owns the
 *   render of their domain object into the exact words they want spoken,
 *   which keeps the speech module decoupled from briefing schema changes
 *   and lets us A/B test the read-aloud script without touching gp-api.
 *
 * Markdown markers and link syntax are stripped — Polly does not
 * interpret them and they would otherwise be read aloud as noise. We
 * also collapse internal whitespace so multi-line source content reads
 * smoothly rather than as awkward pauses.
 */
export const renderBriefingForSpeech = (briefing: Briefing): string => {
  const sections: string[] = []

  // Meeting header line — name, date, location — read in the same order
  // the detail header shows them.
  const header = [
    briefing.meeting_name,
    formatBriefingMeetingDate(briefing.meeting_date),
    briefing.location,
  ]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join('. ')
  if (header) sections.push(header)

  // Executive summary: heading, lead-in, then each summary item. Only emit
  // the heading when the section actually has content — otherwise the audio
  // announces "Executive Summary." straight into the first agenda item.
  const execSummary: string[] = []
  if (briefing.executive_summary.lead_in)
    execSummary.push(briefing.executive_summary.lead_in)
  for (const summaryItem of briefing.executive_summary.items) {
    execSummary.push(`${summaryItem.title}. ${summaryItem.overview}`)
  }
  if (execSummary.length > 0) {
    sections.push('Executive Summary.')
    sections.push(...execSummary)
  }

  // Every agenda item, in page order.
  for (const item of briefing.items) {
    sections.push(renderItem(item))
  }

  return sections
    .map(normalize)
    .filter((section) => section.length > 0)
    .join('\n\n')
}

export const renderItemForSpeech = (item: Item): string =>
  normalize(renderItem(item))

const renderItem = (item: Item): string => {
  const display = item.display
  const parts: string[] = [`${item.title}.`]

  if (display.summary) {
    parts.push('What to expect.')
    parts.push(display.summary)
  }

  // Featured items render their full section stack on the page; non-featured
  // items render the "What to expect" summary only. Mirror that here so the
  // read-aloud matches the page. Section order matches AgendaItemCard:
  // budget impact, constituent sentiment, recent news, talking points.
  if (item.tier === 'featured') {
    if (display.budget_impact?.summary) {
      parts.push('Budget impact.')
      parts.push(display.budget_impact.summary)
    }

    const sentiment = display.constituent_sentiment
    if (sentiment) {
      parts.push('Constituent sentiment.')
      if (
        sentiment.haystaq_status === 'ok' &&
        typeof sentiment.mean_score === 'number'
      ) {
        const support = Math.round(sentiment.mean_score)
        parts.push(
          `${support} percent support, ${100 - support} percent oppose.`,
        )
      }
      if (sentiment.summary) parts.push(sentiment.summary)
      if (sentiment.detail) parts.push(sentiment.detail)
    }

    const news = display.recent_news ?? []
    if (news.length > 0) {
      parts.push('Recent news.')
      for (const entry of news) {
        if (entry.headline) parts.push(entry.headline)
      }
    }

    const talkingPoints = display.talking_points ?? []
    if (talkingPoints.length > 0) {
      parts.push('Talking points.')
      for (const point of talkingPoints) {
        parts.push(point)
      }
    }
  }

  return parts.filter((part) => part.length > 0).join(' ')
}

const normalize = (text: string): string =>
  text
    .replace(/[*_`#>~]+/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
