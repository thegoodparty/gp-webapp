import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import MobileBottomBar from './MobileBottomBar'
import type { Briefing, Item } from '@shared/briefings/types'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import { downloadBriefingPdf } from '@shared/briefings/pdf/downloadBriefingPdf'

vi.mock('../annotations/AnnotationsScope', () => ({
  useAnnotationsCtx: vi.fn(),
}))

vi.mock('@shared/briefings/pdf/downloadBriefingPdf', () => ({
  downloadBriefingPdf: vi.fn(),
}))

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<object>('next/navigation')
  return {
    ...actual,
    usePathname: () => '/dashboard/briefings/town-hall',
  }
})

const mockedUseAnnotationsCtx = vi.mocked(useAnnotationsCtx)
const mockedDownloadBriefingPdf = vi.mocked(downloadBriefingPdf)

type AnnotationsCtxValue = ReturnType<typeof useAnnotationsCtx>

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

// Minimal briefing stub — the component only forwards it to the PDF download
// path, which tests assert is called but don't exercise end-to-end. Typed as
// the full `Briefing` so the test fails to compile if the contract grows new
// required fields.
const briefingStub = {
  experiment_id: 'x',
  briefing_type: 'city_council_meeting',
  briefing_status: 'briefing_ready',
  generated_at: '2026-01-01T00:00:00.000Z',
  official_name: 'Town Hall',
  meeting_date: '2026-01-01',
  estimated_read_minutes: 5,
  executive_summary: { items: [], lead_in: '' },
  items: [],
  sources: [],
  title: 'City Council — Jan 1',
} as unknown as Briefing

describe('<MobileBottomBar>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
    mockedDownloadBriefingPdf.mockReset()
  })

  it('renders the page-selector pill, Download, and Ask AI as siblings in one row on a solid panel', () => {
    setCtx({
      activeCard: {
        key: 'briefing-executive-summary',
        jsonPath: '/executiveSummary',
        titleJsonPath: '/executive_summary/title',
        title: 'Executive Summary',
      },
    })
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(2)}
      />,
    )

    const selectorMatches = screen.getAllByRole('button', {
      name: /executive summary/i,
    })
    // The page-selector pill is the first button whose label is just the
    // section name; the "Ask AI about Executive Summary" button also matches.
    const selector = selectorMatches[0]
    if (!selector) throw new Error('selector button not rendered')
    const download = screen.getByRole('button', { name: /download pdf/i })
    const askAi = screen.getByRole('button', {
      name: /ask ai about executive summary/i,
    })

    // All three controls share a common ancestor (the dock row) so they
    // render as a single horizontal group instead of being scattered.
    const row = selector.parentElement
    expect(row).not.toBeNull()
    expect(row).toContainElement(download)
    expect(row).toContainElement(askAi)

    // The dock itself must be a solid panel with a top border — not a
    // pointer-events-none overlay of floating FABs.
    const dock = row?.parentElement
    expect(dock?.className ?? '').toMatch(/border-t/)
    expect(dock?.className ?? '').not.toMatch(/pointer-events-none/)
  })

  it('calls openAddNoteTopLevel when the Add note button is clicked with an active card', async () => {
    const openAddNoteTopLevel = vi.fn()
    setCtx({
      openAddNoteTopLevel,
      activeCard: {
        key: 'briefing-executive-summary',
        jsonPath: '/executiveSummary',
        titleJsonPath: '/executive_summary/title',
        title: 'Executive Summary',
      },
    })
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(1)}
      />,
    )
    await userEvent.click(
      screen.getByRole('button', { name: /add a note to executive summary/i }),
    )
    expect(openAddNoteTopLevel).toHaveBeenCalledTimes(1)
  })

  it('calls openCardLevelChat when the Briefing assistant button is tapped with an active card', async () => {
    const openCardLevelChat = vi.fn()
    setCtx({
      openCardLevelChat,
      activeCard: {
        key: 'briefing-executive-summary',
        jsonPath: '/executiveSummary',
        titleJsonPath: '/executive_summary/title',
        title: 'Executive Summary',
      },
    })
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(1)}
      />,
    )
    await userEvent.click(
      screen.getByRole('button', { name: /ask ai about executive summary/i }),
    )
    expect(openCardLevelChat).toHaveBeenCalledTimes(1)
  })

  it('calls downloadBriefingPdf with the briefing and lines when Download is clicked', async () => {
    setCtx()
    mockedDownloadBriefingPdf.mockResolvedValue(undefined)
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(1)}
        preparedForLine="Mayor Jane Doe"
        meetingMetaLine="City Council — Jan 1"
        liveBriefingUrl="https://example.com/briefings/town-hall"
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /download pdf/i }))
    expect(mockedDownloadBriefingPdf).toHaveBeenCalledTimes(1)
    expect(mockedDownloadBriefingPdf).toHaveBeenCalledWith(briefingStub, {
      preparedForLine: 'Mayor Jane Doe',
      meetingMetaLine: 'City Council — Jan 1',
      liveBriefingUrl: 'https://example.com/briefings/town-hall',
    })
  })
})
