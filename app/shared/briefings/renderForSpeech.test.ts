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
  } as unknown as Briefing)

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
  } as unknown as Item)

describe('renderBriefingForSpeech', () => {
  it('joins title, executive summary, and featured items into a single text blob', () => {
    const text = renderBriefingForSpeech(
      baseBriefing({
        items: [
          featuredItem({
            display: {
              summary: 'Adopts the FY27 operating budget.',
              constituent_sentiment: {
                summary: 'Mostly favorable.',
                detail: null,
                district_note: null,
                haystaq_column: 'fiscal_responsibility',
                mean_score: 0.6,
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

    expect(text).toContain('City Council meeting briefing for June 1, 2026')
    expect(text).toContain('Three big items tonight.')
    expect(text).toContain('Agenda item: Approve budget.')
    expect(text).toContain('Adopts the FY27 operating budget.')
    expect(text).toContain('Constituent sentiment: Mostly favorable.')
    expect(text).toContain('Budget impact: +$2M to capital reserves.')
    expect(text).toContain('Talking points.')
    expect(text).toContain('Lock in school funding.')
    expect(text).toContain('Defer the new park.')
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

  it('skips non-featured items and empty optional sections', () => {
    const text = renderBriefingForSpeech(
      baseBriefing({
        executive_summary: { items: [], lead_in: '' },
        items: [
          featuredItem({
            title: 'Quiet item',
            display: {
              summary: '',
              constituent_sentiment: null,
              recent_news: null,
              budget_impact: null,
              talking_points: null,
            },
          }),
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
    expect(text).toBe(
      'City Council meeting briefing for June 1, 2026\n\nAgenda item: Quiet item.',
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
  } as unknown as Item)

describe('renderItemForSpeech', () => {
  it('joins title, summary, sentiment, budget, and talking points with single spaces', () => {
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
          mean_score: 0.7,
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
      'Agenda item: Approve new park funding. Council will vote on a 2 million dollar park proposal. Constituent sentiment: Strong support across the district. Budget impact: Adds 2 million to the capital budget. Talking points. Parks improve public health. Funding comes from reserves. Construction begins in spring.',
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
      'Agenda item: Ordinance review. bold italic code heading quote strike',
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
      'Agenda item: Zoning update. First line. Second line. Third line.',
    )
  })

  it('omits optional section labels when sentiment, budget, and talking points are missing', () => {
    const item = itemWithDisplay({
      summary: 'Procedural items only.',
    })
    item.title = 'Routine consent agenda'

    const output = renderItemForSpeech(item)

    expect(output).not.toContain('Constituent sentiment:')
    expect(output).not.toContain('Budget impact:')
    expect(output).not.toContain('Talking points.')
    expect(output).toBe(
      'Agenda item: Routine consent agenda. Procedural items only.',
    )
  })
})
