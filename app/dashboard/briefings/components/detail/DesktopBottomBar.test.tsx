import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import DesktopBottomBar from './DesktopBottomBar'
import {
  useAnnotationsCtx,
  type ActiveCard,
} from '../annotations/AnnotationsScope'

vi.mock('../annotations/AnnotationsScope', async () => {
  const actual = await vi.importActual<
    typeof import('../annotations/AnnotationsScope')
  >('../annotations/AnnotationsScope')
  return {
    ...actual,
    useAnnotationsCtx: vi.fn(),
  }
})

const mockedUseAnnotationsCtx = vi.mocked(useAnnotationsCtx)

type Ctx = ReturnType<typeof useAnnotationsCtx>

const SAMPLE_CARD: ActiveCard = {
  key: 'executive-summary',
  jsonPath: '/executiveSummary',
  titleJsonPath: '/executiveSummary/title',
  title: 'Executive Summary',
}

function setCtx(overrides: Partial<Ctx> = {}) {
  mockedUseAnnotationsCtx.mockReturnValue({
    meetingDate: '2026-01-01',
    topLevelChatAnnotationId: undefined,
    annotations: [],
    activeCard: SAMPLE_CARD,
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

describe('<DesktopBottomBar>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
  })

  it('renders Add note and Briefing assistant buttons', () => {
    setCtx()
    render(<DesktopBottomBar />)
    expect(
      screen.getByRole('button', { name: /add note/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /briefing assistant/i }),
    ).toBeInTheDocument()
  })

  it('calls openAddNoteTopLevel when Add note is clicked with an active card', async () => {
    const openAddNoteTopLevel = vi.fn()
    setCtx({ openAddNoteTopLevel })
    render(<DesktopBottomBar />)
    await userEvent.click(screen.getByRole('button', { name: /add note/i }))
    expect(openAddNoteTopLevel).toHaveBeenCalledTimes(1)
  })

  it('calls openCardLevelChat when Briefing assistant is clicked with an active card', async () => {
    const openCardLevelChat = vi.fn()
    setCtx({ openCardLevelChat })
    render(<DesktopBottomBar />)
    await userEvent.click(
      screen.getByRole('button', { name: /briefing assistant/i }),
    )
    expect(openCardLevelChat).toHaveBeenCalledTimes(1)
  })

  it('disables both buttons when no card is active', () => {
    setCtx({ activeCard: null })
    render(<DesktopBottomBar />)
    expect(screen.getByRole('button', { name: /add note/i })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /briefing assistant/i }),
    ).toBeDisabled()
  })
})
