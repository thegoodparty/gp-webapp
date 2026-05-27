import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import MobileBottomBar from './MobileBottomBar'
import type { Item } from '@shared/briefings/types'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import { useShareScope } from './ShareScope'

vi.mock('../annotations/AnnotationsScope', () => ({
  useAnnotationsCtx: vi.fn(),
}))
vi.mock('./ShareScope', () => ({
  useShareScope: vi.fn(),
}))

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<object>('next/navigation')
  return {
    ...actual,
    usePathname: () => '/dashboard/briefings/town-hall',
  }
})

const mockedUseAnnotationsCtx = vi.mocked(useAnnotationsCtx)
const mockedUseShareScope = vi.mocked(useShareScope)

type AnnotationsCtxValue = ReturnType<typeof useAnnotationsCtx>

const ACTIVE_CARD = {
  key: 'briefing-executive-summary',
  jsonPath: '/executiveSummary',
  titleJsonPath: '/executive_summary/title',
  title: 'Executive Summary',
}

function setCtx(overrides: Partial<AnnotationsCtxValue> = {}) {
  const ctx: AnnotationsCtxValue = {
    meetingDate: '2026-01-01',
    topLevelChatAnnotationId: undefined,
    annotations: [],
    activeCard: null,
    setActiveCard: vi.fn(),
    openAddNoteFromSelection: vi.fn(),
    openAddNoteTopLevel: vi.fn(),
    openReportErrorFromSelection: vi.fn(),
    openEditNote: vi.fn(),
    openViewReport: vi.fn(),
    openNotesSurface: vi.fn(),
    openChatsSurface: vi.fn(),
    openCardLevelChat: vi.fn(),
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

function setShareScope({
  canShare = true,
  openShareDrawer = vi.fn(),
}: { canShare?: boolean; openShareDrawer?: () => void } = {}) {
  mockedUseShareScope.mockReturnValue({ canShare, openShareDrawer })
  return openShareDrawer
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
      }) as unknown as Item,
  )
}

describe('<MobileBottomBar>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
    mockedUseShareScope.mockReset()
  })

  it('renders the page-selector pill, Share, Add note, and Ask AI in a single dock row', () => {
    setCtx({ activeCard: ACTIVE_CARD })
    setShareScope()
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(2)} />)

    // The selector pill and the Ask AI button both contain "Executive
    // Summary"; the pill is the first match (it's the leftmost element).
    const selectorMatches = screen.getAllByRole('button', {
      name: /executive summary/i,
    })
    const selector = selectorMatches[0]
    if (!selector) throw new Error('selector button not rendered')
    const share = screen.getByRole('button', { name: /share briefing/i })
    const askAi = screen.getByRole('button', {
      name: /ask ai about executive summary/i,
    })

    // All controls share a common ancestor (the dock row) so they render as
    // a single horizontal group instead of being scattered.
    const row = selector.parentElement
    expect(row).not.toBeNull()
    expect(row).toContainElement(share)
    expect(row).toContainElement(askAi)
  })

  it('calls openAddNoteTopLevel when the Add note button is tapped with an active card', async () => {
    const openAddNoteTopLevel = vi.fn()
    setCtx({ openAddNoteTopLevel, activeCard: ACTIVE_CARD })
    setShareScope()
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)

    await userEvent.click(
      screen.getByRole('button', { name: /add a note to executive summary/i }),
    )
    expect(openAddNoteTopLevel).toHaveBeenCalledTimes(1)
  })

  it('calls openCardLevelChat when the Briefing assistant button is tapped with an active card', async () => {
    const openCardLevelChat = vi.fn()
    setCtx({ openCardLevelChat, activeCard: ACTIVE_CARD })
    setShareScope()
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)

    await userEvent.click(
      screen.getByRole('button', { name: /ask ai about executive summary/i }),
    )
    expect(openCardLevelChat).toHaveBeenCalledTimes(1)
  })

  it('asks the share scope to open the drawer when Share is clicked', async () => {
    setCtx()
    const openShareDrawer = setShareScope()
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)

    await userEvent.click(
      screen.getByRole('button', { name: /share briefing/i }),
    )
    expect(openShareDrawer).toHaveBeenCalledTimes(1)
  })

  it('hides the share icon when share scope reports !canShare', () => {
    // During a rolling-deploy window where the briefing artifact lacks
    // `briefing_id`, the dock must not render a Share button — clicking
    // one would otherwise produce a broken `/api/v1/briefings/undefined`
    // URL via the drawer.
    setCtx({ activeCard: ACTIVE_CARD })
    setShareScope({ canShare: false })
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)

    expect(
      screen.queryByRole('button', { name: /share briefing/i }),
    ).not.toBeInTheDocument()
    // Other dock controls still render so the rest of the toolbar works.
    expect(
      screen.getByRole('button', { name: /add a note to executive summary/i }),
    ).toBeInTheDocument()
  })
})
