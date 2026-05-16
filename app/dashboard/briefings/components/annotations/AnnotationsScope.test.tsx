import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, testQueryClient } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { annotationsQueryKey } from '@shared/briefings/use-annotations'
import type { StagedDraft } from '../notes-intake/AddNotesDialog'
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
vi.mock('@shared/briefings/attachments-api', () => ({
  uploadAttachment: (...args: unknown[]) => mockUploadAttachment(...args),
}))

let capturedOnSubmit: ((drafts: StagedDraft[]) => Promise<void> | void) | null =
  null
vi.mock('../notes-intake/AddNotesDialog', () => ({
  default: ({
    onSubmit,
  }: {
    onSubmit: (drafts: StagedDraft[]) => Promise<void> | void
  }) => {
    capturedOnSubmit = onSubmit
    return null
  },
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

describe('<AnnotationsScope>', () => {
  beforeEach(() => {
    mockAnnotationsApi.list.mockReset()
    mockAnnotationsApi.create.mockReset()
    mockAnnotationsApi.updateNote.mockReset()
    mockAnnotationsApi.delete.mockReset()
    mockUploadAttachment.mockReset()
    mockAnnotationsApi.list.mockResolvedValue([])
    capturedOnSubmit = null
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

  describe('AddNotesDialog onSubmit', () => {
    const mountAndCaptureOnSubmit = async () => {
      testQueryClient.setQueryData(annotationsQueryKey('briefing_x'), [])
      render(<AnnotationsScope meetingDate="briefing_x" />)
      await waitFor(() => {
        expect(capturedOnSubmit).not.toBeNull()
      })
      return capturedOnSubmit!
    }

    it('commits a typed draft via annotationsApi.create and invalidates the query', async () => {
      mockAnnotationsApi.create.mockResolvedValue({
        id: 'ann_typed',
        kind: 'note',
      })
      const invalidateSpy = vi.spyOn(testQueryClient, 'invalidateQueries')
      const onSubmit = await mountAndCaptureOnSubmit()

      await onSubmit([{ id: 't1', kind: 'typed', body: 'hello world' }])

      expect(mockAnnotationsApi.create).toHaveBeenCalledWith('briefing_x', {
        kind: 'note',
        anchor: { jsonPath: null, start: null, end: null },
        payload: { body: 'hello world' },
      })
      expect(mockUploadAttachment).not.toHaveBeenCalled()
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: annotationsQueryKey('briefing_x'),
      })
    })

    it('commits a file draft via create → uploadAttachment → waitForOcr and invalidates the query', async () => {
      mockAnnotationsApi.create.mockResolvedValue({
        id: 'ann_file',
        kind: 'note',
      })
      mockUploadAttachment.mockResolvedValue({ attachmentId: 'att_1' })
      mockAnnotationsApi.list.mockResolvedValue([
        {
          id: 'ann_file',
          kind: 'note',
          note: {
            attachments: [{ id: 'att_1', ocrStatus: 'completed' }],
          },
        },
      ])
      const invalidateSpy = vi.spyOn(testQueryClient, 'invalidateQueries')
      const onSubmit = await mountAndCaptureOnSubmit()

      const file = new File(['contents'], 'note.txt', { type: 'text/plain' })
      await onSubmit([{ id: 'f1', kind: 'file', file, from: 'upload' }])

      expect(mockAnnotationsApi.create).toHaveBeenCalledWith('briefing_x', {
        kind: 'note',
        anchor: { jsonPath: null, start: null, end: null },
        payload: {},
      })
      expect(mockUploadAttachment).toHaveBeenCalledWith({
        annotationId: 'ann_file',
        file,
      })
      expect(mockAnnotationsApi.list).toHaveBeenCalledWith('briefing_x')
      expect(mockAnnotationsApi.delete).not.toHaveBeenCalled()
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: annotationsQueryKey('briefing_x'),
      })
    })

    it('rolls back the created annotation when uploadAttachment fails, and re-throws', async () => {
      mockAnnotationsApi.create.mockResolvedValue({
        id: 'ann_rollback',
        kind: 'note',
      })
      mockAnnotationsApi.delete.mockResolvedValue(undefined)
      mockUploadAttachment.mockRejectedValue(new Error('s3_upload_failed:500'))
      const invalidateSpy = vi.spyOn(testQueryClient, 'invalidateQueries')
      const onSubmit = await mountAndCaptureOnSubmit()

      const file = new File(['contents'], 'note.txt', { type: 'text/plain' })
      await expect(
        onSubmit([{ id: 'f1', kind: 'file', file, from: 'upload' }]),
      ).rejects.toThrow('s3_upload_failed:500')

      expect(mockAnnotationsApi.create).toHaveBeenCalled()
      expect(mockAnnotationsApi.delete).toHaveBeenCalledWith('ann_rollback')
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: annotationsQueryKey('briefing_x'),
      })
    })
  })
})
