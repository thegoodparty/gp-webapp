import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import MobileBottomBar from './MobileBottomBar'
import type { Item } from '@shared/briefings/types'
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

function setCtx(overrides: Partial<ReturnType<typeof useAnnotationsCtx>> = {}) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
}

function makeItems(n: number): Item[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `item_${i + 1}`,
    itemNumber: String(i + 1),
    title: `Item ${i + 1}`,
    tier: 'standard',
    voteRequired: false,
    tierReason: [],
    display: { summary: '' },
  }))
}

// Minimal briefing stub — the component only forwards it to the PDF download
// path, which tests assert is called but don't exercise end-to-end.
const briefingStub = {
  experimentId: 'x',
  items: [],
  sources: [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

describe('<MobileBottomBar>', () => {
  beforeEach(() => {
    mockedUseAnnotationsCtx.mockReset()
    mockedDownloadBriefingPdf.mockReset()
  })

  it('renders the page-selector pill, Download, and Ask AI as siblings in one row on a solid panel', () => {
    setCtx()
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(2)}
      />,
    )

    const selector = screen.getByRole('button', { name: /executive summary/i })
    const download = screen.getByRole('button', { name: /download pdf/i })
    const askAi = screen.getByRole('button', {
      name: /open briefing assistant/i,
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

  it('opens the notes surface when the Notes button is clicked', async () => {
    const openNotesSurface = vi.fn()
    setCtx({ openNotesSurface })
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(1)}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /open notes/i }))
    expect(openNotesSurface).toHaveBeenCalledTimes(1)
  })

  it('opens the chats surface when the Briefing assistant button is clicked', async () => {
    const openChatsSurface = vi.fn()
    setCtx({ openChatsSurface })
    render(
      <MobileBottomBar
        briefing={briefingStub}
        briefingSlug="town-hall"
        items={makeItems(1)}
      />,
    )
    await userEvent.click(
      screen.getByRole('button', { name: /open briefing assistant/i }),
    )
    expect(openChatsSurface).toHaveBeenCalledTimes(1)
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
