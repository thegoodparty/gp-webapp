import { describe, expect, it } from 'vitest'
import { renderBriefingForSpeech } from './renderForSpeech'
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
              },
              recentNews: null,
              budgetImpact: {
                summary: '+$2M to capital reserves.',
                figures: [],
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
