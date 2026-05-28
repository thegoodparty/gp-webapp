import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import AgendaItemCard from './AgendaItemCard'
import type { Item, Source } from '@shared/briefings/types'

// AgendaItemCard now consumes AnnotationsScope context for active-card
// state and inline card-level notes. Stub it out so the card renders in
// isolation — active-state behaviour is exercised in the scope's own tests.
vi.mock('../annotations/AnnotationsScope', () => ({
  useAnnotationsCtx: () => ({
    annotations: [],
    activeCard: null,
    setActiveCard: vi.fn(),
    openEditNote: vi.fn(),
  }),
}))

vi.mock('../../shared/useReadAloud', () => ({
  useReadAloud: () => ({
    status: 'idle',
    error: null,
    play: vi.fn(),
    stop: vi.fn(),
  }),
}))

function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'item_1',
    item_number: '1',
    title: 'Call to order',
    tier: 'standard',
    vote_required: false,
    tier_reason: ['procedural'],
    display: {
      summary: 'The mayor or chair opens the meeting.',
    },
    ...overrides,
  } as unknown as Item
}

const noSources: Source[] = []

describe('<AgendaItemCard>', () => {
  it('renders a read-aloud button when speechText is provided', () => {
    render(
      <AgendaItemCard
        item={makeItem()}
        itemIndex={0}
        sources={noSources}
        domId="briefing-item-item_1"
        meetingDate="2026-05-18"
        showFeedback={false}
        speechText="The mayor or chair opens the meeting."
      />,
    )

    expect(
      screen.getByRole('button', { name: /read aloud/i }),
    ).toBeInTheDocument()
  })

  it('does not render a read-aloud button when speechText is omitted', () => {
    render(
      <AgendaItemCard
        item={makeItem()}
        itemIndex={0}
        sources={noSources}
        domId="briefing-item-item_1"
        meetingDate="2026-05-18"
        showFeedback={false}
      />,
    )

    expect(
      screen.queryByRole('button', { name: /read aloud/i }),
    ).not.toBeInTheDocument()
  })

  it('renders the read-aloud button as an icon-only control (no visible "Read aloud" text label)', () => {
    render(
      <AgendaItemCard
        item={makeItem()}
        itemIndex={0}
        sources={noSources}
        domId="briefing-item-item_1"
        meetingDate="2026-05-18"
        showFeedback={false}
        speechText="The mayor or chair opens the meeting."
      />,
    )

    const btn = screen.getByRole('button', { name: /read aloud/i })
    expect(btn.textContent?.trim()).toBe('')
  })

  it('renders sections in Lovable order: What to expect → Budget → Sentiment → News → Talking points', () => {
    const item = makeItem({
      title: 'Public Safety Camera Expansion',
      display: {
        summary:
          'The motion bundles vendor selection and the citywide camera location map.',
        constituent_sentiment: {
          haystaq_status: 'ok',
          haystaq_column: 'pub_safety_camera_support',
          mean_score: 72,
          score_direction: 'supports cameras',
          voter_count: 1000,
          summary: 'Northside support climbs to 81%.',
          detail: null,
          source_ids: [],
        },
        budget_impact: {
          summary: '$1.2M one-time install plus $180K/yr ops.',
          figures: [
            {
              label: 'One-time install',
              source_id: 'src_1',
              value: '$1.2M',
            },
          ],
          source_ids: [],
        },
        recent_news: [
          {
            article_type: 'reporting',
            headline: 'Council weighs camera expansion',
            publication: 'Burnsville Sentinel',
            url: 'https://example.com/news',
          },
        ],
        talking_points: [
          '72% citywide support and 81% on the Northside.',
          'Vendor selection bundled with map.',
          '$1.2M one-time plus $180K/yr ops.',
        ],
      },
    })

    const { container } = render(
      <AgendaItemCard
        item={item}
        itemIndex={0}
        sources={noSources}
        domId="briefing-item-item_1"
        meetingDate="2026-05-18"
        showFeedback={false}
      />,
    )

    const html = container.innerHTML
    const positions = [
      'What to expect',
      'Budget impact',
      'Constituent sentiment',
      'Recent news',
      'Talking points',
    ].map((label) => ({ label, index: html.indexOf(label) }))

    expect(positions.every((p) => p.index >= 0)).toBe(true)
    const sorted = [...positions].sort((a, b) => a.index - b.index)
    expect(sorted.map((p) => p.label)).toEqual([
      'What to expect',
      'Budget impact',
      'Constituent sentiment',
      'Recent news',
      'Talking points',
    ])
  })
})
