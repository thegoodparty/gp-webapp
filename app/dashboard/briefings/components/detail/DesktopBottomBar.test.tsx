import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import DesktopBottomBar from './DesktopBottomBar'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'

vi.mock('../annotations/AnnotationsScope', () => ({
  useAnnotationsCtx: vi.fn(),
}))

const mockedUseAnnotationsCtx = vi.mocked(useAnnotationsCtx)

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

describe('<DesktopBottomBar>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
  })

  it('renders Notes and Ask AI buttons', () => {
    setCtx()
    render(<DesktopBottomBar />)
    expect(screen.getByRole('button', { name: /^notes$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ask ai/i })).toBeInTheDocument()
  })

  it('opens the notes surface when the Notes button is clicked', async () => {
    const openNotesSurface = vi.fn()
    setCtx({ openNotesSurface })
    render(<DesktopBottomBar />)
    await userEvent.click(screen.getByRole('button', { name: /^notes$/i }))
    expect(openNotesSurface).toHaveBeenCalledTimes(1)
  })

  it('opens the chats surface when the Ask AI button is clicked', async () => {
    const openChatsSurface = vi.fn()
    setCtx({ openChatsSurface })
    render(<DesktopBottomBar />)
    await userEvent.click(screen.getByRole('button', { name: /ask ai/i }))
    expect(openChatsSurface).toHaveBeenCalledTimes(1)
  })
})
