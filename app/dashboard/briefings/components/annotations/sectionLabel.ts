import type { Item } from '@shared/briefings/types'

/**
 * Derive an uppercase section label for an annotation's anchored quote
 * from its jsonPath:
 *  - `/items/N/...` → items[N].title
 *  - `/executiveSummary[/...]` or `/executive_summary[/...]` → "EXECUTIVE SUMMARY"
 *
 * Both spellings are accepted because card-level annotations store the
 * camelCase form (`/executiveSummary` per `ActiveCard.jsonPath`) while
 * passage anchors land on snake_case field selectors inside the same
 * section (`/executive_summary/title`, etc.).
 *
 * Returns null when the path doesn't match a known section or the index
 * is out of range — callers should hide the label in that case.
 */
export function sectionLabelFromPath(
  jsonPath: string | null,
  items: readonly Item[] | undefined,
): string | null {
  if (!jsonPath) return null
  if (/^\/(executive_summary|executiveSummary)(?:\/|$)/.test(jsonPath)) {
    return 'EXECUTIVE SUMMARY'
  }
  const match = jsonPath.match(/^\/items\/(\d+)(?:\/|$)/)
  if (!match || !items) return null
  const index = Number(match[1])
  const item = items[index]
  if (!item || typeof item.title !== 'string') return null
  return item.title.toUpperCase()
}
