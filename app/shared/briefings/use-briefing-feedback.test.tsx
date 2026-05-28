import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import React from 'react'

const listMock = vi.fn()
const setMock = vi.fn()
const clearMock = vi.fn()

vi.mock('./feedback-api', () => ({
  briefingFeedbackApi: {
    list: (...args: unknown[]) => listMock(...args),
    set: (...args: unknown[]) => setMock(...args),
    clear: (...args: unknown[]) => clearMock(...args),
  },
}))

import { useBriefingFeedback } from './use-briefing-feedback'
import type { ArtifactFeedback } from './feedback-api'

const MEETING_DATE = '2026-06-08'
const ITEM_ID = 'item_alpha'
const OTHER_ITEM_ID = 'item_beta'

const wrapper = (qc: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: qc }, children)
  }

const newClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const fakeRow = (overrides: Partial<ArtifactFeedback>): ArtifactFeedback => ({
  id: 'srv-row',
  organizationSlug: 'org-1',
  submitterUserId: 1,
  artifactId: ITEM_ID,
  feedback: 'positive',
  comment: null,
  createdAt: '2026-06-08T00:00:00.000Z',
  updatedAt: '2026-06-08T00:00:00.000Z',
  ...overrides,
})

beforeEach(() => {
  listMock.mockReset()
  setMock.mockReset()
  clearMock.mockReset()
})

describe('useBriefingFeedback', () => {
  it('exposes feedbackByItemId derived from the GET response', async () => {
    listMock.mockResolvedValue([
      fakeRow({ artifactId: ITEM_ID, feedback: 'positive' }),
      fakeRow({
        id: 'srv-row-2',
        artifactId: OTHER_ITEM_ID,
        feedback: 'negative',
      }),
    ])
    const qc = newClient()
    const { result } = renderHook(() => useBriefingFeedback(MEETING_DATE), {
      wrapper: wrapper(qc),
    })

    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBe('positive'),
    )
    expect(result.current.feedbackByItemId[OTHER_ITEM_ID]).toBe('negative')
    expect(listMock).toHaveBeenCalledWith(MEETING_DATE)
  })

  it('optimistically inserts a vote for an item that has none', async () => {
    listMock.mockResolvedValue([])
    let resolveSet!: (row: ArtifactFeedback) => void
    setMock.mockImplementation(
      () =>
        new Promise<ArtifactFeedback>((resolve) => {
          resolveSet = resolve
        }),
    )

    const qc = newClient()
    const { result } = renderHook(() => useBriefingFeedback(MEETING_DATE), {
      wrapper: wrapper(qc),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setFeedback(ITEM_ID, 'positive')
    })

    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBe('positive'),
    )

    listMock.mockResolvedValue([
      fakeRow({ id: 'srv-1', artifactId: ITEM_ID, feedback: 'positive' }),
    ])
    await act(async () => {
      resolveSet(fakeRow({ id: 'srv-1', feedback: 'positive' }))
    })
    await waitFor(() => expect(setMock).toHaveBeenCalled())
  })

  it('optimistically updates an existing vote in place when toggling', async () => {
    listMock.mockResolvedValue([
      fakeRow({ id: 'srv-1', artifactId: ITEM_ID, feedback: 'positive' }),
    ])
    let resolveSet!: (row: ArtifactFeedback) => void
    setMock.mockImplementation(
      () =>
        new Promise<ArtifactFeedback>((resolve) => {
          resolveSet = resolve
        }),
    )

    const qc = newClient()
    const { result } = renderHook(() => useBriefingFeedback(MEETING_DATE), {
      wrapper: wrapper(qc),
    })
    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBe('positive'),
    )

    act(() => {
      result.current.setFeedback(ITEM_ID, 'negative')
    })

    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBe('negative'),
    )

    listMock.mockResolvedValue([
      fakeRow({ id: 'srv-1', artifactId: ITEM_ID, feedback: 'negative' }),
    ])
    await act(async () => {
      resolveSet(fakeRow({ id: 'srv-1', feedback: 'negative' }))
    })
  })

  it('rolls back on setFeedback error', async () => {
    listMock.mockResolvedValue([
      fakeRow({ id: 'srv-1', artifactId: ITEM_ID, feedback: 'positive' }),
    ])
    setMock.mockRejectedValue(new Error('boom'))

    const qc = newClient()
    const { result } = renderHook(() => useBriefingFeedback(MEETING_DATE), {
      wrapper: wrapper(qc),
    })
    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBe('positive'),
    )

    act(() => {
      result.current.setFeedback(ITEM_ID, 'negative')
    })

    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBe('positive'),
    )
  })

  it('optimistically removes a vote on clearFeedback', async () => {
    listMock.mockResolvedValue([
      fakeRow({ id: 'srv-1', artifactId: ITEM_ID, feedback: 'positive' }),
    ])
    let resolveClear!: () => void
    clearMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveClear = resolve
        }),
    )

    const qc = newClient()
    const { result } = renderHook(() => useBriefingFeedback(MEETING_DATE), {
      wrapper: wrapper(qc),
    })
    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBe('positive'),
    )

    act(() => {
      result.current.clearFeedback(ITEM_ID)
    })

    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBeUndefined(),
    )

    listMock.mockResolvedValue([])
    await act(async () => {
      resolveClear()
    })
    await waitFor(() => expect(clearMock).toHaveBeenCalled())
  })

  it('rolls back on clearFeedback error', async () => {
    listMock.mockResolvedValue([
      fakeRow({ id: 'srv-1', artifactId: ITEM_ID, feedback: 'positive' }),
    ])
    clearMock.mockRejectedValue(new Error('nope'))

    const qc = newClient()
    const { result } = renderHook(() => useBriefingFeedback(MEETING_DATE), {
      wrapper: wrapper(qc),
    })
    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBe('positive'),
    )

    act(() => {
      result.current.clearFeedback(ITEM_ID)
    })

    await waitFor(() =>
      expect(result.current.feedbackByItemId[ITEM_ID]).toBe('positive'),
    )
  })

  describe('comment plumbing', () => {
    it('passes a string comment through to briefingFeedbackApi.set and reflects it in commentByItemId optimistically', async () => {
      listMock.mockResolvedValue([
        fakeRow({ id: 'srv-1', artifactId: ITEM_ID, feedback: 'negative' }),
      ])
      let resolveSet!: (row: ArtifactFeedback) => void
      setMock.mockImplementation(
        () =>
          new Promise<ArtifactFeedback>((resolve) => {
            resolveSet = resolve
          }),
      )

      const qc = newClient()
      const { result } = renderHook(() => useBriefingFeedback(MEETING_DATE), {
        wrapper: wrapper(qc),
      })
      await waitFor(() =>
        expect(result.current.feedbackByItemId[ITEM_ID]).toBe('negative'),
      )

      act(() => {
        result.current.setFeedback(ITEM_ID, 'negative', 'missed the rezoning')
      })

      await waitFor(() =>
        expect(result.current.commentByItemId[ITEM_ID]).toBe(
          'missed the rezoning',
        ),
      )
      expect(setMock).toHaveBeenCalledWith(
        MEETING_DATE,
        ITEM_ID,
        'negative',
        'missed the rezoning',
      )

      await act(async () => {
        resolveSet(
          fakeRow({
            id: 'srv-1',
            feedback: 'negative',
            comment: 'missed the rezoning',
          }),
        )
      })
    })

    it('preserves an existing comment when setFeedback is called without one (undefined)', async () => {
      listMock.mockResolvedValue([
        fakeRow({
          id: 'srv-1',
          artifactId: ITEM_ID,
          feedback: 'negative',
          comment: 'previously typed',
        }),
      ])
      // Keep the mutation in flight so `onSettled` can't trigger a
      // refetch that clobbers the optimistic state we're asserting on.
      let resolveSet!: (row: ArtifactFeedback) => void
      setMock.mockImplementation(
        () =>
          new Promise<ArtifactFeedback>((resolve) => {
            resolveSet = resolve
          }),
      )

      const qc = newClient()
      const { result } = renderHook(() => useBriefingFeedback(MEETING_DATE), {
        wrapper: wrapper(qc),
      })
      await waitFor(() =>
        expect(result.current.commentByItemId[ITEM_ID]).toBe(
          'previously typed',
        ),
      )

      // Re-vote without a comment arg — the optimistic update must keep
      // 'previously typed' visible.
      act(() => {
        result.current.setFeedback(ITEM_ID, 'negative')
      })
      await waitFor(() => expect(setMock).toHaveBeenCalledTimes(1))
      expect(result.current.commentByItemId[ITEM_ID]).toBe('previously typed')
      // The wire call must omit `comment` entirely (4th arg undefined).
      expect(setMock).toHaveBeenLastCalledWith(
        MEETING_DATE,
        ITEM_ID,
        'negative',
        undefined,
      )

      await act(async () => {
        resolveSet(
          fakeRow({
            id: 'srv-1',
            feedback: 'negative',
            comment: 'previously typed',
          }),
        )
      })
    })

    it('passes null to clear an existing comment', async () => {
      listMock.mockResolvedValue([
        fakeRow({
          id: 'srv-1',
          artifactId: ITEM_ID,
          feedback: 'negative',
          comment: 'to be cleared',
        }),
      ])
      // Defer the mutation so the post-mutation invalidate-and-refetch
      // can't replay listMock's stale snapshot over the optimistic clear.
      let resolveSet!: (row: ArtifactFeedback) => void
      setMock.mockImplementation(
        () =>
          new Promise<ArtifactFeedback>((resolve) => {
            resolveSet = resolve
          }),
      )

      const qc = newClient()
      const { result } = renderHook(() => useBriefingFeedback(MEETING_DATE), {
        wrapper: wrapper(qc),
      })
      await waitFor(() =>
        expect(result.current.commentByItemId[ITEM_ID]).toBe('to be cleared'),
      )

      act(() => {
        result.current.setFeedback(ITEM_ID, 'negative', null)
      })
      await waitFor(() =>
        expect(result.current.commentByItemId[ITEM_ID]).toBeNull(),
      )
      expect(setMock).toHaveBeenLastCalledWith(
        MEETING_DATE,
        ITEM_ID,
        'negative',
        null,
      )

      await act(async () => {
        resolveSet(
          fakeRow({ id: 'srv-1', feedback: 'negative', comment: null }),
        )
      })
    })
  })

  it('exposes stable setFeedback / clearFeedback references across renders', async () => {
    listMock.mockResolvedValue([])
    const qc = newClient()
    const { result, rerender } = renderHook(
      () => useBriefingFeedback(MEETING_DATE),
      { wrapper: wrapper(qc) },
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const set1 = result.current.setFeedback
    const clear1 = result.current.clearFeedback
    rerender()
    expect(result.current.setFeedback).toBe(set1)
    expect(result.current.clearFeedback).toBe(clear1)
  })
})
