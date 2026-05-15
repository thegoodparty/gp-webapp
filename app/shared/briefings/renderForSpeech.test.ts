import { describe, expect, it } from 'vitest'
import { renderBriefingForSpeech } from './renderForSpeech'
import type { Briefing } from './types'

const baseBriefing = (overrides: Partial<Briefing> = {}): Briefing => ({
  id: 'b-1',
  slug: 'city-council-june-1-2026',
  meetingId: 'm-1',
  title: 'City Council, June 1',
  meetingDate: 'June 1, 2026',
  status: 'briefing_ready',
  readingTimeMinutes: 5,
  generatedAt: '2026-05-30T10:00:00Z',
  meeting: {
    id: 'm-1',
    name: 'City Council Regular Meeting',
    body: 'City Council',
    type: 'city_council',
    scheduledAt: '2026-06-01T19:00:00-04:00',
    location: 'City Hall',
  },
  executiveSummary: 'Three big items tonight.',
  agenda: [],
  actionItems: [],
  ...overrides,
})

describe('renderBriefingForSpeech', () => {
  it('joins title, executive summary, and action items into a single text blob', () => {
    const text = renderBriefingForSpeech(
      baseBriefing({
        actionItems: [
          {
            id: 'a-1',
            title: 'Approve budget',
            overview: 'Adopts the FY27 operating budget.',
            constituentSentiment: { summary: 'Mostly favorable.', sources: [] },
            recentNews: [],
            budgetImpact: { summary: '+$2M to capital reserves.', sources: [] },
            talkingPoints: ['Lock in school funding.', 'Defer the new park.'],
            sources: [],
          },
        ],
      }),
    )

    expect(text).toContain('City Council, June 1')
    expect(text).toContain('Three big items tonight.')
    expect(text).toContain('Action item: Approve budget.')
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

  it('skips empty optional sections without producing dangling whitespace', () => {
    const text = renderBriefingForSpeech(
      baseBriefing({
        executiveSummary: '',
        actionItems: [
          {
            id: 'a-1',
            title: 'Quiet item',
            overview: '',
            constituentSentiment: null,
            recentNews: [],
            budgetImpact: null,
            talkingPoints: [],
            sources: [],
          },
        ],
      }),
    )
    expect(text).toBe('City Council, June 1\n\nAction item: Quiet item.')
  })
})
