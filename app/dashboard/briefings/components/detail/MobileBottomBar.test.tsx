import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import MobileBottomBar from './MobileBottomBar'
import type { Item } from '@shared/briefings/types'
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

describe('<MobileBottomBar>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
  })

  it('renders the page-selector pill, Notes, and Ask AI as siblings in one row on a solid panel', () => {
    setCtx()
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(2)} />)

    const selector = screen.getByRole('button', { name: /executive summary/i })
    const notes = screen.getByRole('button', { name: /^notes$/i })
    const askAi = screen.getByRole('button', { name: /^ask ai$/i })

    // All three controls share a common ancestor (the dock row) so they
    // render as a single horizontal group instead of being scattered.
    const row = selector.parentElement
    expect(row).not.toBeNull()
    expect(row).toContainElement(notes)
    expect(row).toContainElement(askAi)

    // The dock itself must be a solid panel with a top border — not a
    // pointer-events-none overlay of floating FABs.
    const dock = row?.parentElement
    expect(dock?.className ?? '').toMatch(/border-t/)
    expect(dock?.className ?? '').not.toMatch(/pointer-events-none/)
  })

  it('does not render a Download button (download moved off the mobile bar to match Lovable)', () => {
    setCtx()
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)
    expect(
      screen.queryByRole('button', { name: /download/i }),
    ).not.toBeInTheDocument()
  })

  it('opens the notes surface when Notes is clicked', async () => {
    const openNotesSurface = vi.fn()
    setCtx({ openNotesSurface })
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)
    await userEvent.click(screen.getByRole('button', { name: /^notes$/i }))
    expect(openNotesSurface).toHaveBeenCalledTimes(1)
  })

  it('opens the chats surface when Ask AI is clicked', async () => {
    const openChatsSurface = vi.fn()
    setCtx({ openChatsSurface })
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)
    await userEvent.click(screen.getByRole('button', { name: /^ask ai$/i }))
    expect(openChatsSurface).toHaveBeenCalledTimes(1)
  })
})
