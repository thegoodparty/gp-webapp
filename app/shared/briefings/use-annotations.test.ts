import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import React from 'react'
import type { Annotation } from './types'

const listMock = vi.fn()
const createMock = vi.fn()
const updateNoteMock = vi.fn()
const updateReviewMock = vi.fn()
const deleteMock = vi.fn()

vi.mock('./annotations-api', () => ({
  annotationsApi: {
    list: (...args: unknown[]) => listMock(...args),
    create: (...args: unknown[]) => createMock(...args),
    updateNote: (...args: unknown[]) => updateNoteMock(...args),
    updateReview: (...args: unknown[]) => updateReviewMock(...args),
    delete: (...args: unknown[]) => deleteMock(...args),
  },
}))

const reportErrorToSentryMock = vi.fn()
vi.mock('@shared/sentry', () => ({
  reportErrorToSentry: (...args: unknown[]) => reportErrorToSentryMock(...args),
}))

import { useAnnotations, annotationsQueryKey } from './use-annotations'

const MEETING_DATE = '2026-06-08'
const TARGET = { resourceType: 'briefing', resourceId: MEETING_DATE } as const

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

const makeAnnotation = (overrides: Partial<Annotation> = {}): Annotation => ({
  id: 'ann_default',
  kind: 'note',
  resourceType: 'briefing',
  resourceId: 'briefing_x',
  authorUserId: 1,
  jsonPath: null,
  start: null,
  end: null,
  createdAt: '2026-06-08T00:00:00.000Z',
  updatedAt: '2026-06-08T00:00:00.000Z',
  note: {
    id: 'note_default',
    body: 'hello',
    attachments: [],
    createdAt: '2026-06-08T00:00:00.000Z',
    updatedAt: '2026-06-08T00:00:00.000Z',
  },
  ...overrides,
})

beforeEach(() => {
  listMock.mockReset()
  createMock.mockReset()
  updateNoteMock.mockReset()
  updateReviewMock.mockReset()
  deleteMock.mockReset()
  reportErrorToSentryMock.mockReset()
  listMock.mockResolvedValue([])
})

describe('useAnnotations — error reporting', () => {
  it('reports create failures to Sentry with surface, op, and meetingDate context', async () => {
    const err = new Error('create boom')
    createMock.mockRejectedValue(err)
    const qc = newClient()
    const { result } = renderHook(() => useAnnotations(TARGET), {
      wrapper: wrapper(qc),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.create.mutate({
        kind: 'note',
        anchor: { jsonPath: null, start: null, end: null },
        payload: { body: 'x' },
      })
    })

    await waitFor(() => {
      expect(reportErrorToSentryMock).toHaveBeenCalledWith(err, {
        surface: 'briefing-annotations',
        op: 'create',
        meetingDate: MEETING_DATE,
      })
    })
  })

  it('reports updateNote failures to Sentry with op: updateNote', async () => {
    const err = new Error('update boom')
    updateNoteMock.mockRejectedValue(err)
    const qc = newClient()
    const { result } = renderHook(() => useAnnotations(TARGET), {
      wrapper: wrapper(qc),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.updateNote.mutate({ id: 'ann_1', body: 'new body' })
    })

    await waitFor(() => {
      expect(reportErrorToSentryMock).toHaveBeenCalledWith(err, {
        surface: 'briefing-annotations',
        op: 'updateNote',
        meetingDate: MEETING_DATE,
      })
    })
  })

  it('reports remove failures to Sentry with op: remove', async () => {
    const err = new Error('remove boom')
    deleteMock.mockRejectedValue(err)
    const qc = newClient()
    const { result } = renderHook(() => useAnnotations(TARGET), {
      wrapper: wrapper(qc),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.remove.mutate('ann_1')
    })

    await waitFor(() => {
      expect(reportErrorToSentryMock).toHaveBeenCalledWith(err, {
        surface: 'briefing-annotations',
        op: 'remove',
        meetingDate: MEETING_DATE,
      })
    })
  })
})

describe('useAnnotations — cache writes without invalidate', () => {
  it('create does NOT call invalidateQueries; the optimistic merge is authoritative', async () => {
    const created = makeAnnotation({ id: 'ann_created' })
    createMock.mockResolvedValue(created)
    const qc = newClient()
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')
    const { result } = renderHook(() => useAnnotations(TARGET), {
      wrapper: wrapper(qc),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.create.mutate({
        kind: 'note',
        anchor: { jsonPath: null, start: null, end: null },
        payload: { body: 'x' },
      })
    })

    await waitFor(() => expect(createMock).toHaveBeenCalled())
    await waitFor(() => {
      const cache = qc.getQueryData<Annotation[]>(annotationsQueryKey(TARGET))
      expect(cache?.some((a) => a.id === 'ann_created')).toBe(true)
    })

    expect(invalidateSpy).not.toHaveBeenCalled()
  })

  it('updateNote replaces the matching row in the cache and does NOT invalidate', async () => {
    const existing = makeAnnotation({
      id: 'ann_1',
      note: {
        id: 'note_1',
        body: 'old',
        attachments: [],
        createdAt: '2026-06-08T00:00:00.000Z',
        updatedAt: '2026-06-08T00:00:00.000Z',
      },
    })
    const other = makeAnnotation({ id: 'ann_2' })
    const updated = makeAnnotation({
      id: 'ann_1',
      note: {
        id: 'note_1',
        body: 'new',
        attachments: [],
        createdAt: '2026-06-08T00:00:00.000Z',
        updatedAt: '2026-06-08T00:01:00.000Z',
      },
    })
    listMock.mockResolvedValue([existing, other])
    updateNoteMock.mockResolvedValue(updated)

    const qc = newClient()
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')
    const { result } = renderHook(() => useAnnotations(TARGET), {
      wrapper: wrapper(qc),
    })
    await waitFor(() => expect(result.current.annotations).toHaveLength(2))

    act(() => {
      result.current.updateNote.mutate({ id: 'ann_1', body: 'new' })
    })

    await waitFor(() => {
      const cache = qc.getQueryData<Annotation[]>(annotationsQueryKey(TARGET))
      const row = cache?.find((a) => a.id === 'ann_1')
      expect(row?.note?.body).toBe('new')
    })

    const cache = qc.getQueryData<Annotation[]>(annotationsQueryKey(TARGET))
    expect(cache?.map((a) => a.id)).toEqual(['ann_1', 'ann_2'])
    expect(invalidateSpy).not.toHaveBeenCalled()
  })

  it('remove strips the matching row from the cache and does NOT invalidate', async () => {
    const a = makeAnnotation({ id: 'ann_1' })
    const b = makeAnnotation({ id: 'ann_2' })
    listMock.mockResolvedValue([a, b])
    deleteMock.mockResolvedValue(undefined)

    const qc = newClient()
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')
    const { result } = renderHook(() => useAnnotations(TARGET), {
      wrapper: wrapper(qc),
    })
    await waitFor(() => expect(result.current.annotations).toHaveLength(2))

    act(() => {
      result.current.remove.mutate('ann_1')
    })

    await waitFor(() => {
      const cache = qc.getQueryData<Annotation[]>(annotationsQueryKey(TARGET))
      expect(cache?.map((a) => a.id)).toEqual(['ann_2'])
    })

    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})
