import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import MobileBottomBar from './MobileBottomBar'
import type { Briefing, Item } from '@shared/briefings/types'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'

vi.mock('../annotations/AnnotationsScope', () => ({
  useAnnotationsCtx: vi.fn(),
}))

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<object>('next/navigation')
  return {
    ...actual,
    usePathname: () => '/dashboard/briefings/town-hall',
  }
})

const mockedUseAnnotationsCtx = vi.mocked(useAnnotationsCtx)

type AnnotationsCtxValue = ReturnType<typeof useAnnotationsCtx>

function setCtx(overrides: Partial<AnnotationsCtxValue> = {}) {
  const ctx: AnnotationsCtxValue = {
    meetingDate: '2026-01-01',
    topLevelChatAnnotationId: undefined,
    openAddNoteFromSelection: vi.fn(),
    openAddNoteTopLevel: vi.fn(),
    openReportErrorFromSelection: vi.fn(),
    openEditNote: vi.fn(),
    openViewReport: vi.fn(),
    openNotesSurface: vi.fn(),
    openChatsSurface: vi.fn(),
    openBugReportsSurface: vi.fn(),
    notesCount: 0,
    chatsCount: 0,
    bugReportsCount: 0,
    closeSheet: vi.fn(),
    onChatCreated: vi.fn(),
    ...overrides,
  }
  mockedUseAnnotationsCtx.mockReturnValue(ctx)
}

function makeItems(n: number): Item[] {
  return Array.from(
    { length: n },
    (_, i) =>
      ({
        id: `item_${i + 1}`,
        item_number: String(i + 1),
        title: `Item ${i + 1}`,
        tier: 'standard',
        vote_required: false,
        tier_reason: ['procedural'],
        display: { summary: '' },
      } as unknown as Item),
  )
}

// Minimal briefing stub — the share drawer reads briefing_id and meta to
// build the share URL/subtext. Cast through unknown because the generated
// artifact type has many required fields that don't matter here.
const briefingStub = {
  experiment_id: 'x',
  briefing_id: '01923456-7891-7abc-8def-0123456789ab',
  briefing_type: 'city_council_meeting',
  briefing_status: 'briefing_ready',
  generated_at: '2026-01-01T00:00:00.000Z',
  official_name: 'Town Hall',
  meeting_date: '2026-01-01',
  meeting_name: 'City Council',
  location: 'City Hall',
  estimated_read_minutes: 5,
  executive_summary: { items: [], lead_in: '' },
  items: [],
  sources: [],
  title: 'City Council — Jan 1',
} as unknown as Briefing

describe('<MobileBottomBar>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
  })

  it('renders the page-selector pill, Share, Notes, and Ask AI as siblings in one row on a solid panel', () => {
    setCtx()
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(2)}
      />,
    )

    const selector = screen.getByRole('button', { name: /executive summary/i })
    const share = screen.getByRole('button', { name: /share briefing/i })
    const askAi = screen.getByRole('button', {
      name: /open briefing assistant/i,
    })

    // All controls share a common ancestor (the dock row) so they render as
    // a single horizontal group instead of being scattered.
    const row = selector.parentElement
    expect(row).not.toBeNull()
    expect(row).toContainElement(share)
    expect(row).toContainElement(askAi)

    // The dock itself must be a solid panel with a top border — not a
    // pointer-events-none overlay of floating FABs.
    const dock = row?.parentElement
    expect(dock?.className ?? '').toMatch(/border-t/)
    expect(dock?.className ?? '').not.toMatch(/pointer-events-none/)
  })

  it('opens the notes surface when the Notes button is clicked', async () => {
    const openNotesSurface = vi.fn()
    setCtx({ openNotesSurface })
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(1)}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /open notes/i }))
    expect(openNotesSurface).toHaveBeenCalledTimes(1)
  })

  it('opens the chats surface when the Briefing assistant button is clicked', async () => {
    const openChatsSurface = vi.fn()
    setCtx({ openChatsSurface })
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(1)}
      />,
    )
    await userEvent.click(
      screen.getByRole('button', { name: /open briefing assistant/i }),
    )
    expect(openChatsSurface).toHaveBeenCalledTimes(1)
  })

  it('opens the share drawer when the Share button is clicked', async () => {
    setCtx()
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(1)}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /share briefing/i }))
    // The drawer surfaces a dialog with title "Share Briefing".
    expect(
      screen.getByRole('dialog', { name: /share briefing/i }),
    ).toBeInTheDocument()
  })
})
