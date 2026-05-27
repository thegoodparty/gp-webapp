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

function setCtx(overrides: Partial<Ctx> = {}) {
  mockedUseAnnotationsCtx.mockReturnValue({
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
  } satisfies Ctx)
}

function setShareScope(openShareDrawer = vi.fn()) {
  mockedUseShareScope.mockReturnValue({ openShareDrawer })
  return openShareDrawer
}

describe('<DetailHeaderActions>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
    mockedUseShareScope.mockReset()
  })

  it('renders Share, Notes, and Briefing assistant buttons', () => {
    setCtx()
    setShareScope()
    render(<DetailHeaderActions />)

    expect(screen.getByRole('button', { name: /^share$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^notes$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /briefing assistant/i }),
    ).toBeInTheDocument()
  })

  it('asks the share scope to open the drawer when Share is clicked', async () => {
    setCtx()
    const openShareDrawer = setShareScope()
    render(<DetailHeaderActions />)

    await userEvent.click(screen.getByRole('button', { name: /^share$/i }))
    expect(openShareDrawer).toHaveBeenCalledTimes(1)
  })

  it('opens the notes surface when the Notes button is clicked', async () => {
    const openNotesSurface = vi.fn()
    setCtx({ openNotesSurface })
    setShareScope()
    render(<DetailHeaderActions />)

    await userEvent.click(screen.getByRole('button', { name: /^notes$/i }))
    expect(openNotesSurface).toHaveBeenCalledTimes(1)
  })

  it('opens the chats surface when the Briefing assistant button is clicked', async () => {
    const openChatsSurface = vi.fn()
    setCtx({ openChatsSurface })
    setShareScope()
    render(<DetailHeaderActions />)

    await userEvent.click(
      screen.getByRole('button', { name: /briefing assistant/i }),
    )
    expect(openChatsSurface).toHaveBeenCalledTimes(1)
  })
})
