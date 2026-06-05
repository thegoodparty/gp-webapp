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

  it('renders the page-selector pill, Add note, and Ask AI in a single dock row', () => {
    setCtx({ activeCard: ACTIVE_CARD })
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(2)} />)

    // The selector pill and the assistant button both contain "Executive
    // Summary"; the pill is the first match (it's the leftmost element).
    const selectorMatches = screen.getAllByRole('button', {
      name: /executive summary/i,
    })
    const selector = selectorMatches[0]
    if (!selector) throw new Error('selector button not rendered')
    const askAi = screen.getByRole('button', {
      name: /ask about executive summary/i,
    })

    // Selector + Ask AI share a common ancestor (the dock row).
    const row = selector.parentElement
    expect(row).not.toBeNull()
    expect(row).toContainElement(askAi)
  })

  it('does not render a share button — share lives in the sub-header now', () => {
    setCtx({ activeCard: ACTIVE_CARD })
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)

    expect(
      screen.queryByRole('button', { name: /share briefing/i }),
    ).not.toBeInTheDocument()
  })

  it('calls openAddNoteTopLevel when the Add note button is tapped with an active card', async () => {
    const openAddNoteTopLevel = vi.fn()
    setCtx({ openAddNoteTopLevel, activeCard: ACTIVE_CARD })
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)

    await userEvent.click(
      screen.getByRole('button', { name: /add a note to executive summary/i }),
    )
    expect(openAddNoteTopLevel).toHaveBeenCalledTimes(1)
  })

  it('calls openCardLevelChat when the Briefing assistant button is tapped with an active card', async () => {
    const openCardLevelChat = vi.fn()
    setCtx({ openCardLevelChat, activeCard: ACTIVE_CARD })
    render(<MobileBottomBar briefingSlug="town-hall" items={makeItems(1)} />)

    await userEvent.click(
      screen.getByRole('button', { name: /ask about executive summary/i }),
    )
    expect(openCardLevelChat).toHaveBeenCalledTimes(1)
  })
})
