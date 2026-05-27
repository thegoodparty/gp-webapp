import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import type { Briefing } from '@shared/briefings/types'
import DetailHeaderActions from './DetailHeaderActions'
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

// Minimal briefing stub — the component only forwards it to the PDF download
// path, which the tests don't exercise.
const briefingStub = {
  experimentId: 'x',
  briefingType: 'city_council_meeting',
  briefingStatus: 'briefing_ready',
  generatedAt: '2026-01-01T00:00:00Z',
  officialName: 'Test Official',
  meetingDate: '2026-01-01',
  estimatedReadMinutes: 1,
  executiveSummary: '',
  items: [],
  sources: [],
  title: 'Test briefing',
} satisfies Briefing

describe('<DetailHeaderActions>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
  })

  it('renders Notes and Briefing assistant buttons', () => {
    setCtx()
    render(<DetailHeaderActions briefing={briefingStub} />)
    expect(screen.getByRole('button', { name: /^notes$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /briefing assistant/i }),
    ).toBeInTheDocument()
  })

  it('opens the notes surface when the Notes button is clicked', async () => {
    const openNotesSurface = vi.fn()
    setCtx({ openNotesSurface })
    render(<DetailHeaderActions briefing={briefingStub} />)
    await userEvent.click(screen.getByRole('button', { name: /^notes$/i }))
    expect(openNotesSurface).toHaveBeenCalledTimes(1)
  })

  it('opens the chats surface when the Briefing assistant button is clicked', async () => {
    const openChatsSurface = vi.fn()
    setCtx({ openChatsSurface })
    render(<DetailHeaderActions briefing={briefingStub} />)
    await userEvent.click(
      screen.getByRole('button', { name: /briefing assistant/i }),
    )
    expect(openChatsSurface).toHaveBeenCalledTimes(1)
  })
})
