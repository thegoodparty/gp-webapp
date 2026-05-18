import type { Briefing, Item } from './types'

/**
 * Render a briefing into a single, sentence-friendly plain-text blob
 * suitable for the speech service to synthesize.
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
  sections.push(briefing.title)
  if (briefing.executiveSummary) sections.push(briefing.executiveSummary)
  for (const item of briefing.items) {
    if (item.tier !== 'featured') continue
    sections.push(renderItem(item))
  }
  return sections
    .map(normalize)
    .filter((section) => section.length > 0)
    .join('\n\n')
}

const renderItem = (item: Item): string => {
  const parts: string[] = []
  parts.push(`Agenda item: ${item.title}.`)
  if (item.display.summary) parts.push(item.display.summary)
  if (item.display.constituentSentiment?.summary) {
    parts.push(
      `Constituent sentiment: ${item.display.constituentSentiment.summary}`,
    )
  }
  if (item.display.budgetImpact?.summary) {
    parts.push(`Budget impact: ${item.display.budgetImpact.summary}`)
  }
  const talkingPoints = item.display.talkingPoints ?? []
  if (talkingPoints.length > 0) {
    parts.push('Talking points.')
    for (const point of talkingPoints) {
      parts.push(point)
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
