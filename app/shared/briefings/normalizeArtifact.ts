import type { MeetingBriefingFull } from 'gpApi/generated/agent-job-contracts'

type ExecutiveSummary = MeetingBriefingFull['executive_summary']

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Briefing artifacts in S3 predate the structured executive_summary contract
 * (PR #1873) and may carry the old string shape, a partial object, or no
 * field at all. Normalize at the read boundary so downstream renderers can
 * trust the type without per-component guards.
 */
const normalizeExecutiveSummary = (raw: unknown): ExecutiveSummary => {
  if (typeof raw === 'string') {
    return { lead_in: raw, items: [] } as ExecutiveSummary
  }
  if (!isRecord(raw)) {
    return { lead_in: '', items: [] } as ExecutiveSummary
  }
  const leadIn = typeof raw.lead_in === 'string' ? raw.lead_in : ''
  const items = Array.isArray(raw.items) ? raw.items : []
  return { lead_in: leadIn, items } as ExecutiveSummary
}

export const normalizeBriefingArtifact = <T extends object>(
  artifact: T,
): T & { executive_summary: ExecutiveSummary } => ({
  ...artifact,
  executive_summary: normalizeExecutiveSummary(
    (artifact as { executive_summary?: unknown }).executive_summary,
  ),
})
