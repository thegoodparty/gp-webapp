import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, testQueryClient } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { annotationsQueryKey } from '@shared/briefings/use-annotations'
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

vi.mock('@shared/briefings/attachments-api', () => ({
  uploadAttachment: vi.fn(),
  deleteAttachment: vi.fn(),
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
    mockAnnotationsApi.list.mockResolvedValue([])
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
})
