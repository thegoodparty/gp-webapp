import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, testQueryClient } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { annotationsQueryKey } from '@shared/briefings/use-annotations'
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

vi.mock('@shared/briefings/chat-api', () => ({
  chatApi: {
    createBriefingChat: vi.fn(),
    listMessages: vi.fn().mockResolvedValue([]),
    streamMessage: vi.fn(),
    softDelete: vi.fn(),
  },
}))

type AddNoteSheetOnCreate = (
  anchor: ResolvedAnchor | null,
  body: string,
  attachments: StagedAttachment[],
) => Promise<void> | void

let capturedOnCreate: AddNoteSheetOnCreate | null = null
vi.mock('./AddNoteSheet', () => ({
  default: ({ onCreate }: { onCreate: AddNoteSheetOnCreate }) => {
    capturedOnCreate = onCreate
    return null
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

function ContextAddNoteTrigger() {
  const { openAddNoteTopLevel } = useAnnotationsCtx()
  return (
    <button type="button" onClick={openAddNoteTopLevel}>
      open top-level add note
    </button>
  )
}

async function captureOnCreate(): Promise<AddNoteSheetOnCreate> {
  const user = userEvent.setup()
  testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])
  render(
    <AnnotationsScope meetingDate="briefing_x">
      <ContextAddNoteTrigger />
    </AnnotationsScope>,
  )
  await user.click(
    await screen.findByRole('button', { name: /open top-level add note/i }),
  )
  await waitFor(() => {
    expect(capturedOnCreate).not.toBeNull()
  })
  return capturedOnCreate!
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
    capturedOnCreate = null
    testQueryClient.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('exposes onChatCreated through context and invalidates the annotations query when called', async () => {
    const user = userEvent.setup()
    testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])
    const invalidateSpy = vi.spyOn(testQueryClient, 'invalidateQueries')

    render(
      <AnnotationsScope meetingDate="briefing_x">
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
        anchor: { jsonPath: null, start: null, end: null },
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
        anchor: { jsonPath: null, start: null, end: null },
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
  })
})
