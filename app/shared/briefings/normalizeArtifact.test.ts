import { describe, expect, it } from 'vitest'
import { normalizeBriefingArtifact } from './normalizeArtifact'

const baseArtifact = (executive_summary: unknown) => ({
  experiment_id: 'exp-1',
  briefing_type: 'city_council_meeting',
  briefing_status: 'briefing_ready',
  generated_at: '2026-05-30T10:00:00Z',
  official_name: 'Jane Smith',
  meeting_date: 'June 1, 2026',
  meeting_name: 'City Council',
  location: 'City Hall',
  estimated_read_minutes: 5,
  executive_summary,
  items: [],
  sources: [],
  claims: [],
  disclosure: '',
  required_data_points: [],
  run_metadata: {
    agenda_packet_url: null,
    source_bundle_retrieved_at: '2026-05-30T10:00:00Z',
  },
})

describe('normalizeBriefingArtifact', () => {
  it('wraps a legacy string executive_summary as { lead_in, items: [] }', () => {
    const result = normalizeBriefingArtifact(
      baseArtifact('Three big items tonight.'),
    )
    expect(result.executive_summary).toEqual({
      lead_in: 'Three big items tonight.',
      items: [],
    })
  })

  it('fills missing items as [] when executive_summary has only lead_in', () => {
    const result = normalizeBriefingArtifact(
      baseArtifact({ lead_in: 'Short night.' }),
    )
    expect(result.executive_summary).toEqual({
      lead_in: 'Short night.',
      items: [],
    })
  })

  it('fills missing lead_in as "" when executive_summary has only items', () => {
    const result = normalizeBriefingArtifact(
      baseArtifact({
        items: [{ item_id: 'a-1', title: 'Budget', overview: 'FY27' }],
      }),
    )
    expect(result.executive_summary).toEqual({
      lead_in: '',
      items: [{ item_id: 'a-1', title: 'Budget', overview: 'FY27' }],
    })
  })

  it('returns a default executive_summary when the field is missing entirely', () => {
    const artifact = baseArtifact(undefined)
    // Remove the property so it is truly absent
    delete (artifact as Record<string, unknown>).executive_summary
    const result = normalizeBriefingArtifact(artifact)
    expect(result.executive_summary).toEqual({ lead_in: '', items: [] })
  })

  it('returns a default executive_summary when the field is null', () => {
    const result = normalizeBriefingArtifact(baseArtifact(null))
    expect(result.executive_summary).toEqual({ lead_in: '', items: [] })
  })

  it('drops non-array items and replaces with []', () => {
    const result = normalizeBriefingArtifact(
      baseArtifact({ lead_in: 'Hi', items: 'oops' }),
    )
    expect(result.executive_summary).toEqual({ lead_in: 'Hi', items: [] })
  })

  it('passes a well-formed executive_summary through unchanged', () => {
    const summary = {
      lead_in: 'Two items',
      items: [
        { item_id: 'a-1', title: 'Budget', overview: 'FY27' },
        { item_id: 'a-2', title: 'Zoning', overview: 'Rezone parcel 9' },
      ],
    }
    const result = normalizeBriefingArtifact(baseArtifact(summary))
    expect(result.executive_summary).toEqual(summary)
  })

  it('preserves the rest of the artifact untouched', () => {
    const artifact = baseArtifact({ lead_in: 'Hi', items: [] })
    const result = normalizeBriefingArtifact(artifact)
    expect(result.experiment_id).toBe('exp-1')
    expect(result.briefing_status).toBe('briefing_ready')
    expect(result.items).toEqual([])
    expect(result.sources).toEqual([])
  })
})
