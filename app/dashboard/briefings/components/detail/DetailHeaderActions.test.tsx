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

// Minimal briefing stub — share + annotation surfaces only need briefing_id,
// meta, and title.  Cast through unknown because the generated artifact type
// has many required fields that don't matter here.
const briefingStub = {
  experiment_id: 'x',
  briefing_id: '01923456-7891-7abc-8def-0123456789ab',
  briefing_type: 'city_council_meeting',
  briefing_status: 'briefing_ready',
  generated_at: '2026-01-01T00:00:00Z',
  official_name: 'Test Official',
  meeting_date: '2026-01-01',
  meeting_name: 'City Council',
  location: 'City Hall',
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

  it('renders Share, Notes, and Briefing assistant buttons', () => {
    setCtx()
    render(<DetailHeaderActions briefing={briefingStub} />)
    expect(screen.getByRole('button', { name: /^share$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^notes$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /briefing assistant/i }),
    ).toBeInTheDocument()
  })

  it('opens the share drawer when the Share button is clicked', async () => {
    setCtx()
    render(<DetailHeaderActions briefing={briefingStub} />)
    await userEvent.click(screen.getByRole('button', { name: /^share$/i }))
    expect(
      screen.getByRole('dialog', { name: /share briefing/i }),
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
