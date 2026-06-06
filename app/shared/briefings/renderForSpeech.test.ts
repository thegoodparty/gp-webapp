import { describe, expect, it } from 'vitest'
import { renderBriefingForSpeech, renderItemForSpeech } from './renderForSpeech'
import type { Briefing, Item } from './types'

const baseBriefing = (overrides: Record<string, unknown> = {}): Briefing =>
  ({
    experiment_id: 'exp-1',
    briefing_type: 'city_council_meeting',
    briefing_status: 'briefing_ready',
    generated_at: '2026-05-30T10:00:00Z',
    official_name: 'Jane Smith',
    meeting_date: 'June 1, 2026',
    meeting_name: 'City Council',
    location: 'City Hall',
    estimated_read_minutes: 5,
    executive_summary: { items: [], lead_in: 'Three big items tonight.' },
    items: [],
    sources: [],
    claims: [],
    disclosure: '',
    required_data_points: [],
    run_metadata: {
      agenda_packet_url: null,
      source_bundle_retrieved_at: '2026-05-30T10:00:00Z',
    },
    title: 'City Council meeting briefing for June 1, 2026',
    ...overrides,
  }) as unknown as Briefing

const featuredItem = (overrides: Record<string, unknown> = {}): Item =>
  ({
    id: 'a-1',
    item_number: '1',
    title: 'Approve budget',
    tier: 'featured',
    vote_required: true,
    tier_reason: ['vote_required'],
    display: {
      summary: 'Adopts the FY27 operating budget.',
      constituent_sentiment: null,
      recent_news: null,
      budget_impact: null,
      talking_points: null,
    },
    ...overrides,
  }) as unknown as Item

describe('renderBriefingForSpeech', () => {
  it('reads the header, executive summary, and every item section in page order', () => {
    const text = renderBriefingForSpeech(
      baseBriefing({
        executive_summary: {
          lead_in: 'Three big items tonight.',
          items: [
            {
              item_id: 'a-1',
              title: 'Approve budget',
              overview: 'Adopts FY27.',
            },
          ],
        },
        items: [
          featuredItem({
            display: {
              summary: 'Adopts the FY27 operating budget.',
              constituent_sentiment: {
                summary: 'Mostly favorable.',
                detail: null,
                district_note: null,
                haystaq_column: 'fiscal_responsibility',
                mean_score: 60,
                score_direction: 'positive',
                voter_count: 1200,
                haystaq_status: 'ok',
                source_ids: [],
              },
              recent_news: null,
              budget_impact: {
                summary: '+$2M to capital reserves.',
                figures: [
                  { label: 'reserves', value: '+$2M', source_id: 's1' },
                ],
                source_ids: [],
              },
              talking_points: [
                'Lock in school funding.',
                'Defer the new park.',
                'Keep transit funded.',
              ],
            },
          }),
        ],
      }),
    )

    // Header line mirrors the detail header: name, date, location.
    expect(text).toContain('City Council. June 1, 2026. City Hall')
    expect(text).toContain('Executive Summary.')
    expect(text).toContain('Three big items tonight.')
    expect(text).toContain('Approve budget. Adopts FY27.')
    expect(text).toContain('What to expect.')
    expect(text).toContain('Adopts the FY27 operating budget.')
    expect(text).toContain('Budget impact.')
    expect(text).toContain('+$2M to capital reserves.')
    expect(text).toContain('Constituent sentiment.')
    expect(text).toContain('60 percent support, 40 percent oppose.')
    expect(text).toContain('Mostly favorable.')
    expect(text).toContain('Talking points.')
    expect(text).toContain('Lock in school funding.')

    // Order: header before the executive summary before the agenda item.
    const headerIdx = text.indexOf('City Council. June 1, 2026. City Hall')
    const summaryIdx = text.indexOf('Executive Summary.')
    const whatIdx = text.indexOf('What to expect.')
    expect(headerIdx).toBeGreaterThanOrEqual(0)
    expect(headerIdx).toBeLessThan(summaryIdx)
    expect(summaryIdx).toBeLessThan(whatIdx)
  })

  it('strips markdown markers and link syntax that Polly would otherwise read literally', () => {
    const text = renderBriefingForSpeech(
      baseBriefing({
        executive_summary: {
          items: [],
          lead_in:
            '**Bold** _italic_ `code` and a [link](https://example.com).',
        },
      }),
    )
    expect(text).not.toContain('**')
    expect(text).not.toContain('_italic_')
    expect(text).not.toContain('`code`')
    expect(text).not.toContain('](')
    expect(text).toContain('Bold italic code and a link.')
  })

  it('reads non-featured items too (the page renders them as "What to expect")', () => {
    const text = renderBriefingForSpeech(
      baseBriefing({
        executive_summary: { items: [], lead_in: '' },
        items: [
          {
            id: 'q-1',
            item_number: '2',
            title: 'Procedural matters',
            tier: 'queued',
            vote_required: false,
            tier_reason: ['procedural'],
            display: { summary: 'Routine roll call.' },
          },
        ],
      }),
    )
    // No lead-in and no summary items, so the "Executive Summary." heading
    // is omitted — it would otherwise announce a header into the next item.
    expect(text).toBe(
      'City Council. June 1, 2026. City Hall\n\nProcedural matters. What to expect. Routine roll call.',
    )
  })
})

const itemWithDisplay = (overrides: Record<string, unknown> = {}): Item =>
  ({
    id: 'i-1',
    item_number: '1',
    title: 'Untitled',
    tier: 'featured',
    vote_required: false,
    tier_reason: ['placeholder'],
    display: {
      summary: '',
      constituent_sentiment: null,
      recent_news: null,
      budget_impact: null,
      talking_points: null,
      ...overrides,
    },
  }) as unknown as Item

describe('renderItemForSpeech', () => {
  it('joins title, section headers, and bodies with single spaces in page order', () => {
    const item = {
      id: 'i-2',
      item_number: '3',
      title: 'Approve new park funding',
      tier: 'featured',
      vote_required: true,
      tier_reason: ['vote_required'],
      display: {
        summary: 'Council will vote on a 2 million dollar park proposal.',
        constituent_sentiment: {
          summary: 'Strong support across the district.',
          detail: null,
          district_note: null,
          haystaq_column: 'parks',
          mean_score: 70,
          score_direction: 'positive',
          voter_count: 800,
          haystaq_status: 'ok',
          source_ids: [],
        },
        recent_news: null,
        budget_impact: {
          summary: 'Adds 2 million to the capital budget.',
          figures: [{ label: 'capital', value: '+$2M', source_id: 's1' }],
          source_ids: [],
        },
        talking_points: [
          'Parks improve public health.',
          'Funding comes from reserves.',
          'Construction begins in spring.',
        ],
      },
    } as unknown as Item

    expect(renderItemForSpeech(item)).toBe(
      'Approve new park funding. What to expect. Council will vote on a 2 million dollar park proposal. Budget impact. Adds 2 million to the capital budget. Constituent sentiment. 70 percent support, 30 percent oppose. Strong support across the district. Talking points. Parks improve public health. Funding comes from reserves. Construction begins in spring.',
    )
  })

  it('strips markdown markers from the rendered output', () => {
    const item = itemWithDisplay({
      summary: '*bold* _italic_ `code` # heading > quote ~strike~',
    })
    item.title = 'Ordinance review'

    const output = renderItemForSpeech(item)

    expect(output).not.toMatch(/[*_`#>~]/)
    expect(output).toBe(
      'Ordinance review. What to expect. bold italic code heading quote strike',
    )
  })

  it('collapses internal whitespace (newlines, tabs, repeated spaces) to single spaces', () => {
    const item = itemWithDisplay({
      summary: 'First line.\n\nSecond\tline.   Third    line.',
    })
    item.title = 'Zoning update'

    const output = renderItemForSpeech(item)

    expect(output).not.toMatch(/\n/)
    expect(output).not.toMatch(/\t/)
    expect(output).not.toMatch(/ {2,}/)
    expect(output).toBe(
      'Zoning update. What to expect. First line. Second line. Third line.',
    )
  })

  it('omits optional section headers when sentiment, budget, and talking points are missing', () => {
    const item = itemWithDisplay({
      summary: 'Procedural items only.',
    })
    item.title = 'Routine consent agenda'

    const output = renderItemForSpeech(item)

    expect(output).not.toContain('Constituent sentiment.')
    expect(output).not.toContain('Budget impact.')
    expect(output).not.toContain('Talking points.')
    expect(output).toBe(
      'Routine consent agenda. What to expect. Procedural items only.',
    )
  })
})
