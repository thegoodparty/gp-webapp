import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { Annotation } from '@shared/briefings/types'
import { useEnrichedAnnotations } from './useEnrichedAnnotations'
import * as enrichModule from './enrichForCycler'

function makeAnnotation(overrides: Partial<Annotation> = {}): Annotation {
  return {
    id: overrides.id ?? 'ann_1',
    kind: overrides.kind ?? 'note',
    resourceType: 'briefing',
    resourceId: 'briefing_1',
    authorUserId: 1,
    jsonPath: null,
    start: null,
    end: null,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  } as Annotation
}

describe('useEnrichedAnnotations', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns an empty array when open is false', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const annotations = [makeAnnotation({ id: 'a', kind: 'note' })]

    const { result } = renderHook(() =>
      useEnrichedAnnotations(false, annotations, 'note'),
    )

    expect(result.current).toEqual([])
    expect(spy).not.toHaveBeenCalled()
  })

  it('calls enrichForCycler with the given kind when open is true', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const annotations = [makeAnnotation({ id: 'a', kind: 'note' })]

    renderHook(() => useEnrichedAnnotations(true, annotations, 'note'))

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(annotations, 'note')
  })

  it('filters annotations by the given kind (integration through hook)', () => {
    const annotations: Annotation[] = [
      makeAnnotation({ id: 'a', kind: 'note' }),
      makeAnnotation({ id: 'b', kind: 'bug_report' }),
      makeAnnotation({ id: 'c', kind: 'note' }),
    ]

    const { result } = renderHook(() =>
      useEnrichedAnnotations(true, annotations, 'note'),
    )

    expect(result.current.map((a) => a.id).sort()).toEqual(['a', 'c'])
    expect(result.current.every((a) => a.kind === 'note')).toBe(true)
  })

  it('does not re-run enrichForCycler when a structurally identical new annotations array is passed', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const initial = [
      makeAnnotation({ id: 'a', kind: 'note', updatedAt: 't1' }),
      makeAnnotation({ id: 'b', kind: 'note', updatedAt: 't2' }),
    ]

    const { rerender } = renderHook(
      ({ annotations }: { annotations: Annotation[] }) =>
        useEnrichedAnnotations(true, annotations, 'note'),
      { initialProps: { annotations: initial } },
    )

    expect(spy).toHaveBeenCalledTimes(1)

    const sameContentNewRef = [
      makeAnnotation({ id: 'a', kind: 'note', updatedAt: 't1' }),
      makeAnnotation({ id: 'b', kind: 'note', updatedAt: 't2' }),
    ]
    expect(sameContentNewRef).not.toBe(initial)

    rerender({ annotations: sameContentNewRef })

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('re-runs enrichForCycler when an annotation is added', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const initial = [makeAnnotation({ id: 'a', kind: 'note', updatedAt: 't1' })]

    const { rerender } = renderHook(
      ({ annotations }: { annotations: Annotation[] }) =>
        useEnrichedAnnotations(true, annotations, 'note'),
      { initialProps: { annotations: initial } },
    )

    expect(spy).toHaveBeenCalledTimes(1)

    const withAdded = [
      ...initial,
      makeAnnotation({ id: 'b', kind: 'note', updatedAt: 't2' }),
    ]
    rerender({ annotations: withAdded })

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('re-runs enrichForCycler when an annotation updatedAt changes', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const initial = [makeAnnotation({ id: 'a', kind: 'note', updatedAt: 't1' })]

    const { rerender } = renderHook(
      ({ annotations }: { annotations: Annotation[] }) =>
        useEnrichedAnnotations(true, annotations, 'note'),
      { initialProps: { annotations: initial } },
    )

    expect(spy).toHaveBeenCalledTimes(1)

    const withUpdated = [
      makeAnnotation({ id: 'a', kind: 'note', updatedAt: 't2' }),
    ]
    rerender({ annotations: withUpdated })

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('re-runs enrichForCycler when an annotation jsonPath anchor changes', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const initial = [
      makeAnnotation({
        id: 'a',
        kind: 'note',
        updatedAt: 't1',
        jsonPath: '$.foo',
      }),
    ]

    const { rerender } = renderHook(
      ({ annotations }: { annotations: Annotation[] }) =>
        useEnrichedAnnotations(true, annotations, 'note'),
      { initialProps: { annotations: initial } },
    )

    expect(spy).toHaveBeenCalledTimes(1)

    const withAnchorChange = [
      makeAnnotation({
        id: 'a',
        kind: 'note',
        updatedAt: 't1',
        jsonPath: '$.bar',
      }),
    ]
    rerender({ annotations: withAnchorChange })

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('re-runs enrichForCycler when a note annotation gains an attachment', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const initial = [
      makeAnnotation({
        id: 'a',
        kind: 'note',
        updatedAt: 't1',
        note: {
          id: 'd',
          body: 'b',
          attachments: [],
          createdAt: 't1',
          updatedAt: 't1',
        },
      }),
    ]

    const { rerender } = renderHook(
      ({ annotations }: { annotations: Annotation[] }) =>
        useEnrichedAnnotations(true, annotations, 'note'),
      { initialProps: { annotations: initial } },
    )

    expect(spy).toHaveBeenCalledTimes(1)

    const withAttachment = [
      makeAnnotation({
        id: 'a',
        kind: 'note',
        updatedAt: 't1',
        note: {
          id: 'd',
          body: 'b',
          attachments: [
            {
              id: 'att-1',
              fileName: 'file.pdf',
              mimeType: 'application/pdf',
              sizeBytes: 1,
              ocrStatus: 'pending',
              ocrText: null,
              ocrError: null,
              ocrCompletedAt: null,
              createdAt: 't2',
            },
          ],
          createdAt: 't1',
          updatedAt: 't1',
        },
      }),
    ]
    rerender({ annotations: withAttachment })

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('re-runs enrichForCycler when a note annotation loses an attachment', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const initial = [
      makeAnnotation({
        id: 'a',
        kind: 'note',
        updatedAt: 't1',
        note: {
          id: 'd',
          body: 'b',
          attachments: [
            {
              id: 'att-1',
              fileName: 'file.pdf',
              mimeType: 'application/pdf',
              sizeBytes: 1,
              ocrStatus: 'pending',
              ocrText: null,
              ocrError: null,
              ocrCompletedAt: null,
              createdAt: 't1',
            },
          ],
          createdAt: 't1',
          updatedAt: 't1',
        },
      }),
    ]

    const { rerender } = renderHook(
      ({ annotations }: { annotations: Annotation[] }) =>
        useEnrichedAnnotations(true, annotations, 'note'),
      { initialProps: { annotations: initial } },
    )

    expect(spy).toHaveBeenCalledTimes(1)

    const withoutAttachment = [
      makeAnnotation({
        id: 'a',
        kind: 'note',
        updatedAt: 't1',
        note: {
          id: 'd',
          body: 'b',
          attachments: [],
          createdAt: 't1',
          updatedAt: 't1',
        },
      }),
    ]
    rerender({ annotations: withoutAttachment })

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('re-runs enrichForCycler when a note body changes (note.updatedAt bumped, annotation.updatedAt unchanged)', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const initial = [
      makeAnnotation({
        id: 'a',
        kind: 'note',
        updatedAt: 't1',
        note: {
          id: 'd',
          body: 'before',
          attachments: [],
          createdAt: 't1',
          updatedAt: 't1',
        },
      }),
    ]

    const { rerender } = renderHook(
      ({ annotations }: { annotations: Annotation[] }) =>
        useEnrichedAnnotations(true, annotations, 'note'),
      { initialProps: { annotations: initial } },
    )

    expect(spy).toHaveBeenCalledTimes(1)

    const withEditedBody = [
      makeAnnotation({
        id: 'a',
        kind: 'note',
        updatedAt: 't1',
        note: {
          id: 'd',
          body: 'after',
          attachments: [],
          createdAt: 't1',
          updatedAt: 't2',
        },
      }),
    ]
    rerender({ annotations: withEditedBody })

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('re-runs enrichForCycler when an annotation is removed', () => {
    const spy = vi.spyOn(enrichModule, 'enrichForCycler')
    const initial = [
      makeAnnotation({ id: 'a', kind: 'note', updatedAt: 't1' }),
      makeAnnotation({ id: 'b', kind: 'note', updatedAt: 't2' }),
    ]

    const { rerender } = renderHook(
      ({ annotations }: { annotations: Annotation[] }) =>
        useEnrichedAnnotations(true, annotations, 'note'),
      { initialProps: { annotations: initial } },
    )

    expect(spy).toHaveBeenCalledTimes(1)

    const withRemoved = [
      makeAnnotation({ id: 'a', kind: 'note', updatedAt: 't1' }),
    ]
    rerender({ annotations: withRemoved })

    expect(spy).toHaveBeenCalledTimes(2)
  })
})
