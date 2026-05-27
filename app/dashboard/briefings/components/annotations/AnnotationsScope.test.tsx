import { useEffect } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, testQueryClient } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { annotationsQueryKey } from '@shared/briefings/use-annotations'
import type { Annotation } from '@shared/briefings/types'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'
import type { StagedAttachment } from './NoteAttachmentPicker'
import AnnotationsScope, { useAnnotationsCtx } from './AnnotationsScope'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => router),
  usePathname: vi.fn(() => '/dashboard/briefings/briefing_x'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

const mockAnnotationsApi = {
  list: vi.fn(),
  create: vi.fn(),
  updateNote: vi.fn(),
  delete: vi.fn(),
}

vi.mock('@shared/briefings/annotations-api', () => ({
  annotationsApi: {
    list: (date: string) => mockAnnotationsApi.list(date),
    create: (date: string, input: unknown) =>
      mockAnnotationsApi.create(date, input),
    updateNote: (id: string, body: string) =>
      mockAnnotationsApi.updateNote(id, body),
    delete: (id: string) => mockAnnotationsApi.delete(id),
  },
}))

const mockUploadAttachment = vi.fn()
const mockDeleteAttachment = vi.fn()
const mockResolveMimeType = vi.fn((file: File) => file.type)
vi.mock('@shared/briefings/attachments-api', () => ({
  uploadAttachment: (input: unknown) => mockUploadAttachment(input),
  deleteAttachment: (input: unknown) => mockDeleteAttachment(input),
  resolveMimeType: (file: File) => mockResolveMimeType(file),
}))

type NoteSheetCallbacks = {
  onCreate?: (
    anchor: ResolvedAnchor | null,
    body: string,
    attachments: StagedAttachment[],
  ) => Promise<void> | void
  onClose?: () => void
  sheet?: { kind: string; annotation?: Annotation }
}
let captured_AddNoteSheet: NoteSheetCallbacks = {}
let addNoteSheetIsMounted = false
function AddNoteSheetMock({
  sheet,
  onCreate,
  onClose,
}: {
  sheet: { kind: string; annotation?: Annotation }
  onCreate: NoteSheetCallbacks['onCreate']
  onClose: () => void
}) {
  captured_AddNoteSheet = { onCreate, onClose, sheet }
  useEffect(() => {
    addNoteSheetIsMounted = true
    return () => {
      addNoteSheetIsMounted = false
    }
  }, [])
  return null
}
vi.mock('./AddNoteSheet', () => ({
  default: AddNoteSheetMock,
}))

type BugSheetCallbacks = {
  onCreate?: (
    anchor: {
      jsonPath: string | null
      start: number | null
      end: number | null
    } | null,
    description: string,
  ) => Promise<void> | void
  onClose?: () => void
}
let captured_ReportErrorSheet: BugSheetCallbacks = {}
vi.mock('./ReportErrorSheet', () => ({
  default: ({
    onCreate,
    onClose,
  }: {
    onCreate: BugSheetCallbacks['onCreate']
    onClose: () => void
  }) => {
    captured_ReportErrorSheet = { onCreate, onClose }
    return null
  },
}))

// Mock BriefingAssistantSurface so we can capture its props (especially
// `pendingAnchor` and the inline `onChatCreated`) and drive the handoff
// flow from the test. Renders nothing; tests assert on the captured props.
type BriefingAssistantSurfaceProps = {
  open: boolean
  initialAnnotationId?: string
  pendingAnchor?: {
    jsonPath: string | null
    start: number | null
    end: number | null
  }
  onChatCreated?: (info: {
    annotationId: string
    conversationId: string
  }) => void
}
let captured_BriefingAssistantSurface: BriefingAssistantSurfaceProps = {
  open: false,
}
vi.mock('./BriefingAssistantSurface', () => ({
  BriefingAssistantSurface: (props: BriefingAssistantSurfaceProps) => {
    captured_BriefingAssistantSurface = props
    return null
  },
}))

// Mock HighlightToolbar so we can fire its `onAskAi` callback from the
// test — the production path triggers it when the user clicks "Ask AI"
// on a live selection, which is the entry to the pending-anchor flow.
let captured_HighlightToolbar_onAskAi: (() => void) | null = null
vi.mock('./HighlightToolbar', () => ({
  default: ({ onAskAi }: { onAskAi: () => void }) => {
    captured_HighlightToolbar_onAskAi = onAskAi
    return null
  },
}))

// Mock useSelection so we can supply a live anchor without driving a real
// DOM selection. AnnotationsScope's HighlightToolbar onAskAi reads this.
const mockUseSelection = vi.fn<
  () => {
    jsonPath: string
    start: number
    end: number
    quote: string
    rect: DOMRect
  } | null
>()
vi.mock('@shared/briefings/use-selection', () => ({
  useSelection: () => mockUseSelection(),
}))

const reportErrorToSentryMock = vi.fn()
vi.mock('@shared/sentry', () => ({
  reportErrorToSentry: (...args: unknown[]) => reportErrorToSentryMock(...args),
}))

vi.mock('@shared/briefings/chat-api', () => ({
  chatApi: {
    createBriefingChat: vi.fn(),
    listMessages: vi.fn().mockResolvedValue([]),
    streamMessage: vi.fn(),
    softDelete: vi.fn(),
  },
}))

function ContextChatCreatedTrigger() {
  const { onChatCreated } = useAnnotationsCtx()
  return (
    <button
      type="button"
      onClick={() =>
        onChatCreated({
          annotationId: 'ann_new',
          conversationId: 'conv_new',
          anchor: { jsonPath: 'agenda.0.title', start: 0, end: 5 },
        })
      }
    >
      fire onChatCreated
    </button>
  )
}

function OpenNotesSurfaceTrigger({ annotationId }: { annotationId: string }) {
  const { openNotesSurface, notesCount } = useAnnotationsCtx()
  return (
    <>
      <button type="button" onClick={() => openNotesSurface(annotationId)}>
        open notes surface
      </button>
      <span data-testid="notes-count">{notesCount}</span>
    </>
  )
}

function AddNoteFromSelectionTrigger() {
  const { openAddNoteFromSelection } = useAnnotationsCtx()
  return (
    <button type="button" onClick={openAddNoteFromSelection}>
      open add note
    </button>
  )
}

function ContextAddNoteTrigger() {
  const { openAddNoteTopLevel } = useAnnotationsCtx()
  return (
    <button type="button" onClick={openAddNoteTopLevel}>
      open top-level add note
    </button>
  )
}

function ReportErrorFromSelectionTrigger() {
  const { openReportErrorFromSelection } = useAnnotationsCtx()
  return (
    <button type="button" onClick={openReportErrorFromSelection}>
      open report error
    </button>
  )
}

function AddNoteThenSwitchSurfacesTrigger() {
  const {
    openAddNoteFromSelection,
    openBugReportsSurface,
    openChatsSurface,
    closeSheet,
  } = useAnnotationsCtx()
  return (
    <>
      <button type="button" onClick={openAddNoteFromSelection}>
        open add note
      </button>
      <button type="button" onClick={() => openBugReportsSurface()}>
        open bug reports surface
      </button>
      <button type="button" onClick={() => openChatsSurface()}>
        open chats surface
      </button>
      <button type="button" onClick={closeSheet}>
        close sheet
      </button>
    </>
  )
}

function ReportErrorThenSwitchSurfacesTrigger() {
  const { openReportErrorFromSelection, openNotesSurface, closeSheet } =
    useAnnotationsCtx()
  return (
    <>
      <button type="button" onClick={openReportErrorFromSelection}>
        open report error
      </button>
      <button type="button" onClick={() => openNotesSurface()}>
        open notes surface
      </button>
      <button type="button" onClick={closeSheet}>
        close sheet
      </button>
    </>
  )
}

function EditNoteTrigger({ annotation }: { annotation: Annotation }) {
  const { openEditNote, notesCount } = useAnnotationsCtx()
  return (
    <>
      <button type="button" onClick={() => openEditNote(annotation)}>
        open edit note
      </button>
      <span data-testid="edit-notes-count">{notesCount}</span>
    </>
  )
}

function makeBugAnnotation(id: string): Annotation {
  return {
    id,
    kind: 'bug_report',
    resourceType: 'briefing',
    resourceId: 'briefing_x',
    authorUserId: 1,
    jsonPath: null,
    start: null,
    end: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    bugReport: {
      id: `bug_${id}`,
      description: `description for ${id}`,
      submittedAt: '2025-01-01T00:00:00.000Z',
    },
  }
}

function makeNoteAnnotation(id: string): Annotation {
  return {
    id,
    kind: 'note',
    resourceType: 'briefing',
    resourceId: 'briefing_x',
    authorUserId: 1,
    // Card-level note: jsonPath points at a card, start/end null. Legacy
    // null-jsonPath notes are intentionally filtered out by the scope.
    jsonPath: '/executiveSummary',
    start: null,
    end: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    note: {
      id: `note_${id}`,
      body: `body for ${id}`,
      attachments: [],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  }
}

type AddNoteSheetOnCreate = NonNullable<NoteSheetCallbacks['onCreate']>

async function captureOnCreate(): Promise<AddNoteSheetOnCreate> {
  const user = userEvent.setup()
  testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])
  render(
    <AnnotationsScope
      meetingDate="briefing_x"
      initialActiveCard={{
        key: 'briefing-executive-summary',
        jsonPath: '/executiveSummary',
        title: 'Executive Summary',
      }}
    >
      <ContextAddNoteTrigger />
    </AnnotationsScope>,
  )
  await user.click(
    await screen.findByRole('button', { name: /open top-level add note/i }),
  )
  await waitFor(() => {
    expect(captured_AddNoteSheet.onCreate).toBeDefined()
  })
  return captured_AddNoteSheet.onCreate!
}

function makeStaged(file: File): StagedAttachment {
  return { id: `staged-${file.name}`, file, source: 'document' }
}

describe('<AnnotationsScope>', () => {
  beforeEach(() => {
    mockAnnotationsApi.list.mockReset()
    mockAnnotationsApi.create.mockReset()
    mockAnnotationsApi.updateNote.mockReset()
    mockAnnotationsApi.delete.mockReset()
    mockUploadAttachment.mockReset()
    mockDeleteAttachment.mockReset()
    mockAnnotationsApi.list.mockResolvedValue([])
    captured_AddNoteSheet = {}
    captured_ReportErrorSheet = {}
    captured_BriefingAssistantSurface = { open: false }
    captured_HighlightToolbar_onAskAi = null
    mockUseSelection.mockReset()
    mockUseSelection.mockReturnValue(null)
    addNoteSheetIsMounted = false
    reportErrorToSentryMock.mockReset()
    testQueryClient.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('keeps the notes surface open when the initial annotation is removed but a neighbor exists', async () => {
    const user = userEvent.setup()
    const annX = makeNoteAnnotation('ann_X')
    const annY = makeNoteAnnotation('ann_Y')
    testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [
      annX,
      annY,
    ])

    render(
      <AnnotationsScope
        meetingDate="briefing_x"
        initialActiveCard={{
          key: 'briefing-executive-summary',
          jsonPath: '/executiveSummary',
          title: 'Executive Summary',
        }}
      >
        <OpenNotesSurfaceTrigger annotationId="ann_X" />
      </AnnotationsScope>,
    )

    await user.click(
      await screen.findByRole('button', { name: /open notes surface/i }),
    )

    // Surface is open — vaul renders the drawer overlay with data-state="open".
    await waitFor(() => {
      expect(document.querySelector('[data-vaul-overlay]')).toHaveAttribute(
        'data-state',
        'open',
      )
    })

    expect(screen.getByTestId('notes-count')).toHaveTextContent('2')

    // Simulate the original annotation being deleted from another flow. The
    // user may have cycled to a neighboring annotation already; closing the
    // surface mid-read would be jarring. The surface should stay open and
    // fall back to the remaining annotation.
    mockAnnotationsApi.list.mockResolvedValue([annY])
    await act(async () => {
      testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [annY])
    })

    await waitFor(() => {
      expect(screen.getByTestId('notes-count')).toHaveTextContent('1')
    })

    // Surface stays open — AnnotationSurfaceSheet's internal fallback selects
    // the remaining annotation.
    expect(document.querySelector('[data-vaul-overlay]')).toHaveAttribute(
      'data-state',
      'open',
    )
  })

  it('opens the notes surface focused on the newly-created note after AddNoteSheet save', async () => {
    const user = userEvent.setup()
    testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])

    // The new annotation that gets created when AddNoteSheet onCreate fires.
    const newAnn = makeNoteAnnotation('ann_NEW')
    mockAnnotationsApi.create.mockResolvedValue(newAnn)
    mockAnnotationsApi.list.mockResolvedValue([newAnn])

    render(
      <AnnotationsScope
        meetingDate="briefing_x"
        initialActiveCard={{
          key: 'briefing-executive-summary',
          jsonPath: '/executiveSummary',
          title: 'Executive Summary',
        }}
      >
        <AddNoteFromSelectionTrigger />
      </AnnotationsScope>,
    )

    // Open the AddNoteSheet (in add_note_new mode with null anchor).
    await user.click(
      await screen.findByRole('button', { name: /open add note/i }),
    )

    // Drive the AddNoteSheet save → close flow directly via captured props.
    await act(async () => {
      await captured_AddNoteSheet.onCreate?.(null, 'hello world', [])
      captured_AddNoteSheet.onClose?.()
    })

    expect(mockAnnotationsApi.create).toHaveBeenCalledWith('briefing_x', {
      kind: 'note',
      // No live selection in this test → null anchor on the sheet → the
      // scope falls back to the active card (Executive Summary).
      anchor: { jsonPath: '/executiveSummary', start: null, end: null },
      payload: { body: 'hello world' },
    })

    // Optimistic cache write should make the new annotation visible.
    await waitFor(() => {
      const cached = testQueryClient.getQueryData<Annotation[]>(
        annotationsQueryKey('briefing_x'),
      )
      expect(cached?.some((a) => a.id === 'ann_NEW')).toBe(true)
    })

    // The notes surface drawer is open after onCreate resolves. The
    // surface-opening setOverlay is driven by a ref + watch effect so the
    // close transition can't clobber it.
    await waitFor(() => {
      const overlays = document.querySelectorAll('[data-vaul-overlay]')
      const openOverlay = Array.from(overlays).find(
        (el) => el.getAttribute('data-state') === 'open',
      )
      expect(openOverlay).toBeDefined()
    })
  })

  it('opens the bug reports surface focused on the newly-created bug after ReportErrorSheet save', async () => {
    const user = userEvent.setup()
    testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])

    const newBug = makeBugAnnotation('bug_NEW')
    mockAnnotationsApi.create.mockResolvedValue(newBug)
    mockAnnotationsApi.list.mockResolvedValue([newBug])

    render(
      <AnnotationsScope
        meetingDate="briefing_x"
        initialActiveCard={{
          key: 'briefing-executive-summary',
          jsonPath: '/executiveSummary',
          title: 'Executive Summary',
        }}
      >
        <ReportErrorFromSelectionTrigger />
      </AnnotationsScope>,
    )

    await user.click(
      await screen.findByRole('button', { name: /open report error/i }),
    )

    await act(async () => {
      await captured_ReportErrorSheet.onCreate?.(null, 'this fact is wrong')
      captured_ReportErrorSheet.onClose?.()
    })

    expect(mockAnnotationsApi.create).toHaveBeenCalledWith('briefing_x', {
      kind: 'bug_report',
      anchor: { jsonPath: null, start: null, end: null },
      payload: { description: 'this fact is wrong' },
    })

    await waitFor(() => {
      const cached = testQueryClient.getQueryData<Annotation[]>(
        annotationsQueryKey('briefing_x'),
      )
      expect(cached?.some((a) => a.id === 'bug_NEW')).toBe(true)
    })

    await waitFor(() => {
      const overlays = document.querySelectorAll('[data-vaul-overlay]')
      const openOverlay = Array.from(overlays).find(
        (el) => el.getAttribute('data-state') === 'open',
      )
      expect(openOverlay).toBeDefined()
    })
  })

  it('does not clobber the AddNoteSheet when a pending note lands while the sheet is still open', async () => {
    const user = userEvent.setup()
    testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])

    const newAnn = makeNoteAnnotation('ann_NEW_NOTE')
    mockAnnotationsApi.create.mockResolvedValue(newAnn)
    mockAnnotationsApi.list.mockResolvedValue([newAnn])

    render(
      <AnnotationsScope
        meetingDate="briefing_x"
        initialActiveCard={{
          key: 'briefing-executive-summary',
          jsonPath: '/executiveSummary',
          title: 'Executive Summary',
        }}
      >
        <AddNoteThenSwitchSurfacesTrigger />
      </AnnotationsScope>,
    )

    // Open the AddNoteSheet so overlay.kind = 'add_note_new'.
    await user.click(
      await screen.findByRole('button', { name: /open add note/i }),
    )

    // Drive onCreate but DO NOT call onClose. The note ends up in
    // annotations (optimistic write), and pendingNewNoteIdRef gets set.
    // The watch effect fires next — without fix #1, it sets overlay to
    // 'surface_notes' even though the user is still in the AddNoteSheet
    // (overlay.kind === 'add_note_new'), clobbering the open sheet.
    await act(async () => {
      await captured_AddNoteSheet.onCreate?.(null, 'hello', [])
      await Promise.resolve()
    })

    // Without fix #1, the notes surface would have opened (showing the
    // note body). With the guard, overlay stays 'add_note_new' and no
    // surface opens.
    expect(screen.queryByText('body for ann_NEW_NOTE')).not.toBeInTheDocument()
    expect(screen.queryByText('No notes yet')).not.toBeInTheDocument()
  })

  it('does not clobber the ReportErrorSheet when a pending bug lands while the sheet is still open', async () => {
    const user = userEvent.setup()
    testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])

    const newBug = makeBugAnnotation('bug_PENDING')
    mockAnnotationsApi.create.mockResolvedValue(newBug)
    mockAnnotationsApi.list.mockResolvedValue([newBug])

    render(
      <AnnotationsScope
        meetingDate="briefing_x"
        initialActiveCard={{
          key: 'briefing-executive-summary',
          jsonPath: '/executiveSummary',
          title: 'Executive Summary',
        }}
      >
        <ReportErrorThenSwitchSurfacesTrigger />
      </AnnotationsScope>,
    )

    // Open the ReportErrorSheet so overlay.kind = 'report_error_new'.
    await user.click(
      await screen.findByRole('button', { name: /open report error/i }),
    )

    // Drive onCreate but DO NOT call onClose. Annotations gets the bug
    // (optimistic write), pendingNewBugReportIdRef gets set. The watch
    // effect runs — without fix #1, it would open 'surface_bug_reports'
    // and clobber the open ReportErrorSheet.
    await act(async () => {
      await captured_ReportErrorSheet.onCreate?.(null, 'wrong')
      await Promise.resolve()
    })

    // Without fix #1, the bug reports surface would have opened. With the
    // guard, overlay stays 'report_error_new' and no surface opens.
    expect(
      screen.queryByText('description for bug_PENDING'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('No bug reports yet')).not.toBeInTheDocument()
  })

  it('clears pending-id refs when the overlay closes so a stale ref does not bind a later overlay', async () => {
    // Drive the AddNoteSheet onCreate to set pendingNewNoteIdRef, then
    // explicitly close the overlay. The cleanup effect should clear the
    // ref so a future overlay open doesn't pick up the stale id. We then
    // explicitly open the notes surface; with fix #2, the explicit
    // `initialAnnotationId` is undefined (no stale ref override) and the
    // surface opens on the cycler default (first item).
    testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])

    const newAnn = makeNoteAnnotation('ann_STALE')
    mockAnnotationsApi.create.mockResolvedValue(newAnn)
    mockAnnotationsApi.list.mockResolvedValue([newAnn])

    render(
      <AnnotationsScope
        meetingDate="briefing_x"
        initialActiveCard={{
          key: 'briefing-executive-summary',
          jsonPath: '/executiveSummary',
          title: 'Executive Summary',
        }}
      >
        <AddNoteThenSwitchSurfacesTrigger />
      </AnnotationsScope>,
    )

    const user = userEvent.setup()

    // Open AddNoteSheet (overlay = add_note_new) and drive onCreate to set
    // the ref. With fix #1, the watch effect won't fire here because
    // overlay is add_note_new, not 'closed'.
    await user.click(
      await screen.findByRole('button', { name: /open add note/i }),
    )
    await act(async () => {
      await captured_AddNoteSheet.onCreate?.(null, 'hi', [])
      await Promise.resolve()
    })

    // Close the sheet — overlay → 'closed'. Without fix #1's guard the
    // watch effect would fire AFTER close transition; with fix #1 + fix
    // #2 (cleanup), the cleanup runs on overlay.kind=closed and clears
    // the ref before any later overlay can pick it up.
    await act(async () => {
      captured_AddNoteSheet.onClose?.()
      await Promise.resolve()
    })

    // The notes surface should still have opened — it's the intended
    // handoff. We only assert here that the open flow works.
    await waitFor(() => {
      expect(screen.getByText('body for ann_STALE')).toBeInTheDocument()
    })
  })

  it('exposes onChatCreated through context and invalidates the annotations query when called', async () => {
    const user = userEvent.setup()
    testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])
    const invalidateSpy = vi.spyOn(testQueryClient, 'invalidateQueries')

    render(
      <AnnotationsScope
        meetingDate="briefing_x"
        initialActiveCard={{
          key: 'briefing-executive-summary',
          jsonPath: '/executiveSummary',
          title: 'Executive Summary',
        }}
      >
        <ContextChatCreatedTrigger />
      </AnnotationsScope>,
    )

    await user.click(
      await screen.findByRole('button', { name: /fire onchatcreated/i }),
    )

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: annotationsQueryKey('briefing_x'),
      })
    })
  })

  describe('Pending-anchor → cycler handoff', () => {
    it('hands off from preempt empty-composer to cycler-focused-on-new-chat once the new annotation lands in the cache', async () => {
      // The new chat the user's about to mint. We pre-stage it on the API
      // mock so the `handleChatCreated` invalidate-and-refetch picks it up
      // — without this, the refetch races our setQueryData and wins.
      const newChat: Annotation = {
        id: 'ann_new_chat',
        kind: 'chat',
        resourceType: 'briefing',
        resourceId: 'briefing_x',
        authorUserId: 1,
        jsonPath: 'agenda.0.title',
        start: 0,
        end: 5,
        createdAt: '2026-05-27T00:00:00.000Z',
        updatedAt: '2026-05-27T00:00:00.000Z',
      }
      mockAnnotationsApi.list.mockResolvedValue([newChat])
      testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])

      // User has a live selection.
      mockUseSelection.mockReturnValue({
        jsonPath: 'agenda.0.title',
        start: 0,
        end: 5,
        quote: 'hello',
        rect: {} as DOMRect,
      })

      render(
        <AnnotationsScope
          meetingDate="briefing_x"
          initialActiveCard={{
            key: 'briefing-executive-summary',
            jsonPath: '/executiveSummary',
            title: 'Executive Summary',
          }}
        >
          {null}
        </AnnotationsScope>,
      )

      // Click "Ask AI" on the selection → overlay flips to surface_chats
      // with pendingAnchor; BriefingAssistantSurface receives the preempt.
      await waitFor(() => {
        expect(captured_HighlightToolbar_onAskAi).not.toBeNull()
      })
      act(() => {
        captured_HighlightToolbar_onAskAi?.()
      })

      await waitFor(() => {
        expect(captured_BriefingAssistantSurface.open).toBe(true)
      })
      expect(captured_BriefingAssistantSurface.pendingAnchor).toEqual({
        jsonPath: 'agenda.0.title',
        start: 0,
        end: 5,
      })
      expect(
        captured_BriefingAssistantSurface.initialAnnotationId,
      ).toBeUndefined()

      // First send: BriefingAssistantSurface fires onChatCreated with the
      // new annotation id. The inline handler in AnnotationsScope stashes
      // it in pendingNewChatIdRef and invalidates the annotations query.
      act(() => {
        captured_BriefingAssistantSurface.onChatCreated?.({
          annotationId: 'ann_new_chat',
          conversationId: 'conv_new',
        })
      })

      // The watch effect on [annotations, overlay] runs once the refetch
      // settles with the new chat — swaps overlay from "preempt with
      // pendingAnchor" to "cycler focused on initialAnnotationId=new_id".
      await waitFor(() => {
        expect(captured_BriefingAssistantSurface.initialAnnotationId).toBe(
          'ann_new_chat',
        )
      })
      expect(captured_BriefingAssistantSurface.pendingAnchor).toBeUndefined()
    })
  })

  describe('openAddNoteTopLevel routing', () => {
    it('opens the notes surface focused on the existing card-level note when one is already attached to the active card', async () => {
      // Seed a card-level note matching the default active card (Executive
      // Summary): jsonPath set to the card root, start/end null. The
      // "Add note" header button should open the notes cycler focused on
      // this note rather than the new-note sheet — that's the new
      // single-card-note-per-card constraint.
      const user = userEvent.setup()
      const existing: Annotation = {
        ...makeNoteAnnotation('ann_existing_card'),
        // makeNoteAnnotation already uses /executiveSummary as the
        // jsonPath, but spell it out here so the linkage to the active
        // card's jsonPath is obvious.
        jsonPath: '/executiveSummary',
        start: null,
        end: null,
      }
      testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [
        existing,
      ])

      render(
        <AnnotationsScope
          meetingDate="briefing_x"
          initialActiveCard={{
            key: 'briefing-executive-summary',
            jsonPath: '/executiveSummary',
            title: 'Executive Summary',
          }}
        >
          <ContextAddNoteTrigger />
        </AnnotationsScope>,
      )

      await user.click(
        await screen.findByRole('button', { name: /open top-level add note/i }),
      )

      // The notes cycler (vaul drawer) should be open. AddNoteSheet (the
      // single-note edit sheet, mocked above) must NOT have mounted —
      // we route directly to the cycler so pagination between notes
      // works the same as for passage-anchored notes.
      await waitFor(() => {
        expect(document.querySelector('[data-vaul-overlay]')).toHaveAttribute(
          'data-state',
          'open',
        )
      })
      expect(addNoteSheetIsMounted).toBe(false)
    })

    it('opens the new-note sheet when the active card has no card-level note yet', async () => {
      // Seed only a passage-anchored note (start/end set) — that
      // shouldn't count as a card-level note for the active card, so
      // the header button should open the new-note sheet as usual.
      const user = userEvent.setup()
      const passageNote: Annotation = {
        ...makeNoteAnnotation('ann_passage'),
        jsonPath: '/executiveSummary',
        start: 0,
        end: 5,
      }
      testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [
        passageNote,
      ])

      render(
        <AnnotationsScope
          meetingDate="briefing_x"
          initialActiveCard={{
            key: 'briefing-executive-summary',
            jsonPath: '/executiveSummary',
            title: 'Executive Summary',
          }}
        >
          <ContextAddNoteTrigger />
        </AnnotationsScope>,
      )

      await user.click(
        await screen.findByRole('button', { name: /open top-level add note/i }),
      )

      await waitFor(() => {
        expect(addNoteSheetIsMounted).toBe(true)
      })
    })
  })

  describe('AddNoteSheet onCreate', () => {
    it('creates a typed-only note and skips the upload path', async () => {
      mockAnnotationsApi.create.mockResolvedValue({
        id: 'ann_typed',
        kind: 'note',
      })
      const onCreate = await captureOnCreate()

      await onCreate(null, 'hello world', [])

      expect(mockAnnotationsApi.create).toHaveBeenCalledWith('briefing_x', {
        kind: 'note',
        anchor: { jsonPath: '/executiveSummary', start: null, end: null },
        payload: { body: 'hello world' },
      })
      expect(mockUploadAttachment).not.toHaveBeenCalled()
    })

    it('omits the body field for attachment-only saves so the contract accepts an empty payload', async () => {
      mockAnnotationsApi.create.mockResolvedValue({
        id: 'ann_attach_only',
        kind: 'note',
      })
      mockUploadAttachment.mockResolvedValue({ attachmentId: 'att_1' })
      const onCreate = await captureOnCreate()

      const file = new File(['x'], 'memo.pdf', { type: 'application/pdf' })
      await onCreate(null, '   ', [makeStaged(file)])

      expect(mockAnnotationsApi.create).toHaveBeenCalledWith('briefing_x', {
        kind: 'note',
        anchor: { jsonPath: '/executiveSummary', start: null, end: null },
        payload: {},
      })
      expect(mockUploadAttachment).toHaveBeenCalledWith({
        annotationId: 'ann_attach_only',
        file,
      })
    })

    it('uploads each staged attachment after creating the note and invalidates the query', async () => {
      mockAnnotationsApi.create.mockResolvedValue({
        id: 'ann_with_files',
        kind: 'note',
      })
      mockUploadAttachment
        .mockResolvedValueOnce({ attachmentId: 'att_1' })
        .mockResolvedValueOnce({ attachmentId: 'att_2' })
      const invalidateSpy = vi.spyOn(testQueryClient, 'invalidateQueries')
      const onCreate = await captureOnCreate()

      const fileA = new File(['a'], 'a.png', { type: 'image/png' })
      const fileB = new File(['b'], 'b.pdf', { type: 'application/pdf' })
      await onCreate(null, 'two files', [makeStaged(fileA), makeStaged(fileB)])

      expect(mockUploadAttachment).toHaveBeenCalledTimes(2)
      expect(mockUploadAttachment).toHaveBeenNthCalledWith(1, {
        annotationId: 'ann_with_files',
        file: fileA,
      })
      expect(mockUploadAttachment).toHaveBeenNthCalledWith(2, {
        annotationId: 'ann_with_files',
        file: fileB,
      })
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: annotationsQueryKey('briefing_x'),
      })
    })

    it('surfaces a partial-failure error when an upload rejects, listing the failed file names', async () => {
      mockAnnotationsApi.create.mockResolvedValue({
        id: 'ann_partial',
        kind: 'note',
      })
      mockUploadAttachment
        .mockResolvedValueOnce({ attachmentId: 'att_ok' })
        .mockRejectedValueOnce(new Error('s3_upload_failed:500'))
      const invalidateSpy = vi.spyOn(testQueryClient, 'invalidateQueries')
      const onCreate = await captureOnCreate()

      const ok = new File(['x'], 'ok.png', { type: 'image/png' })
      const bad = new File(['y'], 'bad.pdf', { type: 'application/pdf' })
      await expect(
        onCreate(null, 'hi', [makeStaged(ok), makeStaged(bad)]),
      ).rejects.toThrow(/Saved your note, but couldn't upload: bad\.pdf/i)

      expect(mockAnnotationsApi.create).toHaveBeenCalledOnce()
      // The cache is still invalidated so the saved note + successful
      // attachment show up.
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: annotationsQueryKey('briefing_x'),
      })
    })

    it('reports each attachment upload failure to Sentry with surface, op, annotationId, and fileName context', async () => {
      mockAnnotationsApi.create.mockResolvedValue({
        id: 'ann_sentry',
        kind: 'note',
      })
      const uploadErr = new Error('s3_upload_failed:500')
      mockUploadAttachment.mockRejectedValueOnce(uploadErr)
      const onCreate = await captureOnCreate()

      const file = new File(['y'], 'doc.pdf', { type: 'application/pdf' })
      await expect(onCreate(null, 'hi', [makeStaged(file)])).rejects.toThrow()

      expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
      expect(reportErrorToSentryMock).toHaveBeenCalledWith(uploadErr, {
        surface: 'briefing-annotations',
        op: 'uploadAttachment',
        annotationId: 'ann_sentry',
        fileName: 'doc.pdf',
      })
    })

    it('transitions overlay to add_note_edit on partial attachment failure so a retry does not create a duplicate note', async () => {
      const user = userEvent.setup()
      testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])
      const createdAnnotation: Annotation = {
        id: 'ann_retry',
        kind: 'note',
        resourceType: 'briefing',
        resourceId: 'briefing_x',
        authorUserId: 1,
        jsonPath: null,
        start: null,
        end: null,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        note: {
          id: 'note_ann_retry',
          body: 'hi',
          attachments: [],
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      }
      mockAnnotationsApi.create.mockResolvedValue(createdAnnotation)
      mockUploadAttachment.mockRejectedValueOnce(new Error('s3 down'))

      render(
        <AnnotationsScope
          meetingDate="briefing_x"
          initialActiveCard={{
            key: 'briefing-executive-summary',
            jsonPath: '/executiveSummary',
            title: 'Executive Summary',
          }}
        >
          <ContextAddNoteTrigger />
        </AnnotationsScope>,
      )

      await user.click(
        await screen.findByRole('button', {
          name: /open top-level add note/i,
        }),
      )
      await waitFor(() => {
        expect(captured_AddNoteSheet.onCreate).toBeDefined()
      })

      const file = new File(['y'], 'bad.pdf', { type: 'application/pdf' })
      await act(async () => {
        await expect(
          captured_AddNoteSheet.onCreate?.(null, 'hi', [makeStaged(file)]),
        ).rejects.toThrow()
      })

      // Sheet is still mounted, now in edit mode against the just-created
      // annotation. A subsequent Save will hit onUpdate (no duplicate note).
      expect(addNoteSheetIsMounted).toBe(true)
      expect(captured_AddNoteSheet.sheet?.kind).toBe('add_note_edit')
      expect(captured_AddNoteSheet.sheet?.annotation?.id).toBe('ann_retry')
      // Only one annotation was ever created.
      expect(mockAnnotationsApi.create).toHaveBeenCalledOnce()
    })
  })

  describe('edit-mode sync', () => {
    it('does not force-close the sheet when the edited annotation disappears from the cache mid-edit', async () => {
      const user = userEvent.setup()
      const ann = makeNoteAnnotation('ann_editing')
      testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [ann])
      mockAnnotationsApi.list.mockResolvedValue([ann])

      render(
        <AnnotationsScope
          meetingDate="briefing_x"
          initialActiveCard={{
            key: 'briefing-executive-summary',
            jsonPath: '/executiveSummary',
            title: 'Executive Summary',
          }}
        >
          <EditNoteTrigger annotation={ann} />
        </AnnotationsScope>,
      )

      await user.click(
        await screen.findByRole('button', { name: /open edit note/i }),
      )

      // Sheet is mounted in edit mode.
      await waitFor(() => {
        expect(addNoteSheetIsMounted).toBe(true)
      })
      expect(captured_AddNoteSheet.sheet?.kind).toBe('add_note_edit')

      // Now simulate the annotation being deleted from another tab — the
      // refetch lands with the annotation gone.
      mockAnnotationsApi.list.mockResolvedValue([])
      await act(async () => {
        testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])
      })

      // Wait for the cache update to propagate through useAnnotations →
      // the wrapper component re-renders with notesCount === 0. Any effect
      // in AnnotationsScope that runs in response to annotations changing
      // has had a chance to fire by this point.
      await waitFor(() => {
        expect(screen.getByTestId('edit-notes-count')).toHaveTextContent('0')
      })

      // The sheet should still be mounted — the user's in-progress typing
      // (held in AddNoteSheet's body state) must not be silently dropped.
      // If they hit Save, the existing error-banner path surfaces the issue.
      expect(addNoteSheetIsMounted).toBe(true)
      expect(captured_AddNoteSheet.sheet?.kind).toBe('add_note_edit')
    })
  })
})
