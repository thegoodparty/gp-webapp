import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import FeedbackRow from './FeedbackRow'

// Stub the hook so the test can drive setFeedback / clearFeedback without
// the real React Query mutation lifecycle. Each test recreates `current`
// via `feedbackByItemId` to mirror what the hook would return after the
// optimistic update fires.
const setFeedbackMock = vi.fn()
const clearFeedbackMock = vi.fn()
let mockState: {
  feedbackByItemId: Record<string, 'positive' | 'negative' | undefined>
  commentByItemId: Record<string, string | null | undefined>
} = {
  feedbackByItemId: {},
  commentByItemId: {},
}

vi.mock('@shared/briefings/use-briefing-feedback', () => ({
  useBriefingFeedback: () => ({
    feedbackByItemId: mockState.feedbackByItemId,
    commentByItemId: mockState.commentByItemId,
    isLoading: false,
    setFeedback: setFeedbackMock,
    clearFeedback: clearFeedbackMock,
  }),
}))

const MEETING_DATE = '2026-06-08'
const ITEM_ID = 'item_alpha'

beforeEach(() => {
  setFeedbackMock.mockReset()
  clearFeedbackMock.mockReset()
  mockState = { feedbackByItemId: {}, commentByItemId: {} }
})

describe('<FeedbackRow> thumbs-up path', () => {
  it('clicking thumbs-up sets positive without opening the composer', async () => {
    const user = userEvent.setup()
    render(<FeedbackRow meetingDate={MEETING_DATE} itemId={ITEM_ID} />)

    await user.click(screen.getByRole('button', { name: /^yes$/i }))

    expect(setFeedbackMock).toHaveBeenCalledWith(ITEM_ID, 'positive')
    // Composer should never render for a positive vote.
    expect(
      screen.queryByPlaceholderText(/tell us what was off/i),
    ).not.toBeInTheDocument()
  })
})

describe('<FeedbackRow> thumbs-down composer', () => {
  it('clicking thumbs-down sets negative immediately AND opens the composer', async () => {
    const user = userEvent.setup()
    render(<FeedbackRow meetingDate={MEETING_DATE} itemId={ITEM_ID} />)

    await user.click(screen.getByRole('button', { name: /^no$/i }))

    expect(setFeedbackMock).toHaveBeenCalledWith(ITEM_ID, 'negative')
    expect(setFeedbackMock).toHaveBeenCalledTimes(1)
    // Composer is now open.
    expect(
      await screen.findByPlaceholderText(/tell us what was off/i),
    ).toBeInTheDocument()
  })

  it('Save fires a second setFeedback call carrying the typed comment (trimmed)', async () => {
    const user = userEvent.setup()
    render(<FeedbackRow meetingDate={MEETING_DATE} itemId={ITEM_ID} />)

    await user.click(screen.getByRole('button', { name: /^no$/i }))
    const textarea = await screen.findByPlaceholderText(/tell us what was off/i)
    await user.type(textarea, '  the summary missed the rezoning  ')
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    // First call: the immediate vote (no comment).
    expect(setFeedbackMock.mock.calls[0]).toEqual([ITEM_ID, 'negative'])
    // Second call: the popover Save, with trimmed comment.
    expect(setFeedbackMock.mock.calls[1]).toEqual([
      ITEM_ID,
      'negative',
      'the summary missed the rezoning',
    ])
    // Composer closes after Save.
    expect(
      screen.queryByPlaceholderText(/tell us what was off/i),
    ).not.toBeInTheDocument()
  })

  it('Save with an empty / whitespace-only textarea sends null (clear)', async () => {
    const user = userEvent.setup()
    render(<FeedbackRow meetingDate={MEETING_DATE} itemId={ITEM_ID} />)

    await user.click(screen.getByRole('button', { name: /^no$/i }))
    await screen.findByPlaceholderText(/tell us what was off/i)
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(setFeedbackMock.mock.calls[1]).toEqual([ITEM_ID, 'negative', null])
  })

  it('"Not now" closes the composer without a second setFeedback call', async () => {
    const user = userEvent.setup()
    render(<FeedbackRow meetingDate={MEETING_DATE} itemId={ITEM_ID} />)

    await user.click(screen.getByRole('button', { name: /^no$/i }))
    await screen.findByPlaceholderText(/tell us what was off/i)
    await user.click(screen.getByRole('button', { name: /not now/i }))

    expect(setFeedbackMock).toHaveBeenCalledTimes(1)
    expect(
      screen.queryByPlaceholderText(/tell us what was off/i),
    ).not.toBeInTheDocument()
  })

  it('prefills the textarea with a previously-stored comment when the user re-opens via thumbs-down', async () => {
    mockState = {
      feedbackByItemId: { [ITEM_ID]: undefined },
      commentByItemId: { [ITEM_ID]: 'older note' },
    }
    const user = userEvent.setup()
    render(<FeedbackRow meetingDate={MEETING_DATE} itemId={ITEM_ID} />)

    await user.click(screen.getByRole('button', { name: /^no$/i }))
    const textarea = (await screen.findByPlaceholderText(
      /tell us what was off/i,
    )) as HTMLTextAreaElement
    expect(textarea.value).toBe('older note')
  })

  it('clicking thumbs-down while already negative clears the vote and does NOT open the composer', async () => {
    mockState = {
      feedbackByItemId: { [ITEM_ID]: 'negative' },
      commentByItemId: { [ITEM_ID]: null },
    }
    const user = userEvent.setup()
    render(<FeedbackRow meetingDate={MEETING_DATE} itemId={ITEM_ID} />)

    await user.click(screen.getByRole('button', { name: /^no$/i }))

    expect(clearFeedbackMock).toHaveBeenCalledWith(ITEM_ID)
    expect(setFeedbackMock).not.toHaveBeenCalled()
    expect(
      screen.queryByPlaceholderText(/tell us what was off/i),
    ).not.toBeInTheDocument()
  })
})
