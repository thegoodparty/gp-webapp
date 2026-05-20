import { describe, expect, it } from 'vitest'
import { renderBriefingForSpeech, renderItemForSpeech } from './renderForSpeech'
import type { Briefing, Item } from './types'

const baseBriefing = (overrides: Partial<Briefing> = {}): Briefing => ({
  experimentId: 'exp-1',
  briefingType: 'city_council_meeting',
  briefingStatus: 'briefing_ready',
  generatedAt: '2026-05-30T10:00:00Z',
  officialName: 'Jane Smith',
  meetingDate: 'June 1, 2026',
  estimatedReadMinutes: 5,
  executiveSummary: 'Three big items tonight.',
  items: [],
  sources: [],
  title: 'City Council meeting briefing for June 1, 2026',
  ...overrides,
})

const featuredItem = (overrides: Partial<Item> = {}): Item => ({
  id: 'a-1',
  itemNumber: '1',
  title: 'Approve budget',
  tier: 'featured',
  voteRequired: true,
  tierReason: [],
  display: {
    summary: 'Adopts the FY27 operating budget.',
    constituentSentiment: null,
    recentNews: null,
    budgetImpact: null,
    talkingPoints: null,
    sourceIds: [],
  },
  ...overrides,
})

describe('renderBriefingForSpeech', () => {
  it('joins title, executive summary, and featured items into a single text blob', () => {
    const text = renderBriefingForSpeech(
      baseBriefing({
        items: [
          featuredItem({
            display: {
              summary: 'Adopts the FY27 operating budget.',
              constituentSentiment: {
                summary: 'Mostly favorable.',
                detail: null,
                districtNote: null,
                haystaqColumn: 'fiscal_responsibility',
                meanScore: 0.6,
                scoreDirection: 'positive',
                voterCount: 1200,
                haystaqStatus: 'ok',
                haystaqSource: 'curated',
                sourceIds: [],
              },
              recentNews: null,
              budgetImpact: {
                summary: '+$2M to capital reserves.',
                figures: [],
                sourceIds: [],
              },
              talkingPoints: ['Lock in school funding.', 'Defer the new park.'],
              sourceIds: [],
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
        executiveSummary:
          '**Bold** _italic_ `code` and a [link](https://example.com).',
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
        executiveSummary: '',
        items: [
          featuredItem({
            title: 'Quiet item',
            display: {
              summary: '',
              constituentSentiment: null,
              recentNews: null,
              budgetImpact: null,
              talkingPoints: [],
              sourceIds: [],
            },
          }),
          {
            id: 'q-1',
            itemNumber: '2',
            title: 'Procedural matters',
            tier: 'queued',
            voteRequired: false,
            tierReason: [],
            display: {
              summary: 'Routine roll call.',
              sourceIds: [],
            },
          },
        ],
      }),
    )
    expect(text).toBe(
      'City Council meeting briefing for June 1, 2026\n\nAgenda item: Quiet item.',
    )
  })
})

const itemWithDisplay = (overrides: Partial<Item['display']> = {}): Item => ({
  id: 'i-1',
  itemNumber: '1',
  title: 'Untitled',
  tier: 'featured',
  voteRequired: false,
  tierReason: [],
  display: {
    summary: '',
    constituentSentiment: null,
    recentNews: null,
    budgetImpact: null,
    talkingPoints: null,
    sourceIds: [],
    ...overrides,
  },
})

describe('renderItemForSpeech', () => {
  it('joins title, summary, sentiment, budget, and talking points with single spaces', () => {
    const item: Item = {
      id: 'i-2',
      itemNumber: '3',
      title: 'Approve new park funding',
      tier: 'featured',
      voteRequired: true,
      tierReason: [],
      display: {
        summary: 'Council will vote on a 2 million dollar park proposal.',
        constituentSentiment: {
          summary: 'Strong support across the district.',
          detail: null,
          districtNote: null,
          haystaqColumn: 'parks',
          meanScore: 0.7,
          scoreDirection: 'positive',
          voterCount: 800,
          haystaqStatus: 'ok',
          haystaqSource: 'curated',
          sourceIds: [],
        },
        recentNews: null,
        budgetImpact: {
          summary: 'Adds 2 million to the capital budget.',
          figures: [],
          sourceIds: [],
        },
        talkingPoints: [
          'Parks improve public health.',
          'Funding comes from reserves.',
        ],
        sourceIds: [],
      },
    }

    expect(renderItemForSpeech(item)).toBe(
      'Agenda item: Approve new park funding. Council will vote on a 2 million dollar park proposal. Constituent sentiment: Strong support across the district. Budget impact: Adds 2 million to the capital budget. Talking points. Parks improve public health. Funding comes from reserves.',
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
