import type { Item } from '@shared/briefings/types'

/**
 * Derive an uppercase section label for an annotation's anchored quote
 * from its jsonPath:
 *  - `/items/N/...` → items[N].title
 *  - `/executive_summary/...` → "EXECUTIVE SUMMARY"
 *
 * Returns null when the path doesn't match a known section or the index
 * is out of range — callers should hide the label in that case.
 */
export function sectionLabelFromPath(
  jsonPath: string | null,
  items: readonly Item[] | undefined,
): string | null {
  if (!jsonPath) return null
  if (/^\/executive_summary(?:\/|$)/.test(jsonPath)) {
    return 'EXECUTIVE SUMMARY'
  }
  const match = jsonPath.match(/^\/items\/(\d+)(?:\/|$)/)
  if (!match || !items) return null
  const index = Number(match[1])
  const item = items[index]
  if (!item || typeof item.title !== 'string') return null
  return item.title.toUpperCase()
}
