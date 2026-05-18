import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import MobileBottomBar from './MobileBottomBar'
import type { Item } from '@shared/briefings/types'

vi.mock('../annotations/AnnotationsScope', () => ({
  useAnnotationsCtx: () => ({
    meetingDate: 'briefing_x',
    onChatCreated: vi.fn(),
    topLevelChatAnnotationId: undefined,
    openAddNoteTopLevel: vi.fn(),
  }),
}))

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<object>('next/navigation')
  return {
    ...actual,
    usePathname: () => '/dashboard/briefings/town-hall',
  }
})

function makeItems(n: number): Item[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `item_${i + 1}`,
    itemNumber: String(i + 1),
    title: `Item ${i + 1}`,
    tier: 'standard',
    voteRequired: false,
    tierReason: [],
    display: { summary: '' },
  }))
}

describe('<MobileBottomBar>', () => {
  it('renders the page-selector pill, Download, and Ask AI as siblings in one row on a solid panel', () => {
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(2)} />)

    const selector = screen.getByRole('button', { name: /executive summary/i })
    const download = screen.getByRole('button', { name: /download pdf/i })
    const askAi = screen.getByRole('button', { name: /open briefing assistant/i })

    // All three controls share a common ancestor (the dock row) so they
    // render as a single horizontal group instead of being scattered.
    const row = selector.parentElement
    expect(row).not.toBeNull()
    expect(row).toContainElement(download)
    expect(row).toContainElement(askAi)

    // The dock itself must be a solid panel with a top border — not a
    // pointer-events-none overlay of floating FABs.
    const dock = row?.parentElement
    expect(dock?.className ?? '').toMatch(/border-t/)
    expect(dock?.className ?? '').not.toMatch(/pointer-events-none/)
  })
})
