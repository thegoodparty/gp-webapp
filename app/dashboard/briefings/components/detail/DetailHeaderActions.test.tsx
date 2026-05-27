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
// path, which the tests don't exercise. Cast through unknown because the
// generated artifact type has many required fields that don't matter here.
const briefingStub = {
  experiment_id: 'x',
  briefing_type: 'city_council_meeting',
  briefing_status: 'briefing_ready',
  generated_at: '2026-01-01T00:00:00Z',
  official_name: 'Test Official',
  meeting_date: '2026-01-01',
  estimated_read_minutes: 1,
  executive_summary: { items: [], lead_in: '' },
  items: [],
  sources: [],
  title: 'Test briefing',
} as unknown as Briefing

describe('<DetailHeaderActions>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
  })

  it('renders Add note and Briefing assistant buttons', () => {
    setCtx({
      activeCard: {
        key: 'briefing-executive-summary',
        jsonPath: '/executiveSummary',
        title: 'Executive Summary',
      },
    })
    render(<DetailHeaderActions briefing={briefingStub} />)
    expect(
      screen.getByRole('button', { name: /^add note$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /briefing assistant/i }),
    ).toBeInTheDocument()
  })

  it('calls openAddNoteTopLevel when the Add note button is clicked with an active card', async () => {
    const openAddNoteTopLevel = vi.fn()
    setCtx({
      openAddNoteTopLevel,
      activeCard: {
        key: 'briefing-executive-summary',
        jsonPath: '/executiveSummary',
        title: 'Executive Summary',
      },
    })
    render(<DetailHeaderActions briefing={briefingStub} />)
    await userEvent.click(screen.getByRole('button', { name: /^add note$/i }))
    expect(openAddNoteTopLevel).toHaveBeenCalledTimes(1)
  })

  it('disables Add note when no card is active', () => {
    setCtx({ activeCard: null })
    render(<DetailHeaderActions briefing={briefingStub} />)
    expect(screen.getByRole('button', { name: /^add note$/i })).toBeDisabled()
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
