import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import DetailHeaderActions from './DetailHeaderActions'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import { useShareScope } from './ShareScope'

vi.mock('../annotations/AnnotationsScope', () => ({
  useAnnotationsCtx: vi.fn(),
}))
vi.mock('./ShareScope', () => ({
  useShareScope: vi.fn(),
}))

const mockedUseAnnotationsCtx = vi.mocked(useAnnotationsCtx)
const mockedUseShareScope = vi.mocked(useShareScope)

type Ctx = ReturnType<typeof useAnnotationsCtx>

const ACTIVE_CARD = {
  key: 'briefing-executive-summary',
  jsonPath: '/executiveSummary',
  titleJsonPath: '/executive_summary/title',
  title: 'Executive Summary',
}

function setCtx(overrides: Partial<Ctx> = {}) {
  mockedUseAnnotationsCtx.mockReturnValue({
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
  } satisfies Ctx)
}

function setShareScope({
  canShare = true,
  openShareDrawer = vi.fn(),
}: { canShare?: boolean; openShareDrawer?: () => void } = {}) {
  mockedUseShareScope.mockReturnValue({ canShare, openShareDrawer })
  return openShareDrawer
}

describe('<DetailHeaderActions>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
    mockedUseShareScope.mockReset()
  })

  it('renders Share, Add note, and Briefing assistant buttons when a card is active', () => {
    setCtx({ activeCard: ACTIVE_CARD })
    setShareScope()
    render(<DetailHeaderActions />)

    expect(screen.getByRole('button', { name: /^share$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^add note$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /briefing assistant/i }),
    ).toBeInTheDocument()
  })

  it('asks the share scope to open the drawer when Share is clicked', async () => {
    setCtx({ activeCard: ACTIVE_CARD })
    const openShareDrawer = setShareScope()
    render(<DetailHeaderActions />)

    await userEvent.click(screen.getByRole('button', { name: /^share$/i }))
    expect(openShareDrawer).toHaveBeenCalledTimes(1)
  })

  it('hides the Share button when share scope reports !canShare', () => {
    // Rolling-deploy window: gp-webapp has the share-drawer code but
    // gp-api's response hasn't grown `briefing_id` yet. `canShare` is
    // false in that case and the button must drop out entirely so we
    // don't render a control that points at a broken URL.
    setCtx({ activeCard: ACTIVE_CARD })
    setShareScope({ canShare: false })
    render(<DetailHeaderActions />)

    expect(
      screen.queryByRole('button', { name: /^share$/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^add note$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /briefing assistant/i }),
    ).toBeInTheDocument()
  })

  it('calls openAddNoteTopLevel when the Add note button is clicked with an active card', async () => {
    const openAddNoteTopLevel = vi.fn()
    setCtx({ openAddNoteTopLevel, activeCard: ACTIVE_CARD })
    setShareScope()
    render(<DetailHeaderActions />)
    await userEvent.click(screen.getByRole('button', { name: /^add note$/i }))
    expect(openAddNoteTopLevel).toHaveBeenCalledTimes(1)
  })

  it('disables Add note when no card is active', () => {
    setCtx({ activeCard: null })
    setShareScope()
    render(<DetailHeaderActions />)
    expect(screen.getByRole('button', { name: /^add note$/i })).toBeDisabled()
  })

  it('calls openCardLevelChat when the Briefing assistant button is clicked with an active card', async () => {
    const openCardLevelChat = vi.fn()
    setCtx({ openCardLevelChat, activeCard: ACTIVE_CARD })
    setShareScope()
    render(<DetailHeaderActions />)
    await userEvent.click(
      screen.getByRole('button', { name: /briefing assistant/i }),
    )
    expect(openCardLevelChat).toHaveBeenCalledTimes(1)
  })

  it('disables the Briefing assistant button when no card is active', () => {
    setCtx({ activeCard: null })
    setShareScope()
    render(<DetailHeaderActions />)
    expect(
      screen.getByRole('button', { name: /briefing assistant/i }),
    ).toBeDisabled()
  })
})
