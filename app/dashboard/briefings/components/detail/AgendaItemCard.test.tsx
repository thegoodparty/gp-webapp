import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import AgendaItemCard from './AgendaItemCard'
import type { Item, Source } from '@shared/briefings/types'

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
    itemNumber: '1',
    title: 'Call to order',
    tier: 'standard',
    voteRequired: false,
    tierReason: [],
    display: {
      summary: 'The mayor or chair opens the meeting.',
    },
    ...overrides,
  }
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
})
