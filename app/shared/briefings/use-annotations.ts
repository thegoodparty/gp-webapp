'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reportErrorToSentry } from '@shared/sentry'
import { annotationsApi } from './annotations-api'
import type { AnnotationsClient } from './annotations-client'
import type {
  Annotation,
  AnnotationKind,
  AnnotationResourceType,
  CreateAnnotationInput,
} from './types'

export interface AnnotationsTarget {
  resourceType: AnnotationResourceType
  resourceId: string
}

export interface UseAnnotationsOptions {
  kinds?: AnnotationKind[]
}

export const annotationsQueryKey = (
  target: AnnotationsTarget | string,
  kinds?: AnnotationKind[],
) => {
  // Tolerate the legacy `(meetingDate)` call shape: a bare string is the
  // briefing's meeting date, addressing the same resource the object form
  // describes with resourceType 'briefing'.
  const resourceType =
    typeof target === 'string' ? 'briefing' : target.resourceType
  const resourceId = typeof target === 'string' ? target : target.resourceId
  return [
    'briefings',
    resourceType,
    resourceId,
    'annotations',
    kinds && kinds.length > 0 ? [...kinds].sort().join(',') : 'all',
  ] as const
}

const QK = annotationsQueryKey

/**
 * TanStack Query wrapper over the AnnotationsClient.
 *
 * Bound to the real gp-api client. The localStorage stub
 * (`annotations-stub.ts`) is still available for development against
 * fixtures by swapping the import below.
 *
 * For resourceType 'briefing', `resourceId` is the YYYY-MM-DD slug that
 * addresses the briefing in `GET /v1/meetings/:date/briefing`; annotations
 * endpoints nest under the same shape.
 */
const client: AnnotationsClient = annotationsApi

/**
 * Poll while any attached file is mid-OCR. 5s feels tight enough that the
 * UI doesn't look stuck and loose enough that we're not pounding the API.
 */
const OCR_POLL_INTERVAL_MS = 5_000

const hasPendingOcr = (annotations: Annotation[] | undefined): boolean => {
  if (!annotations) return false
  for (const ann of annotations) {
    if (!ann.note) continue
    for (const att of ann.note.attachments) {
      if (att.ocrStatus === 'pending' || att.ocrStatus === 'processing') {
        return true
      }
    }
  }
  return false
}

export function useAnnotations(
  target: AnnotationsTarget,
  options?: UseAnnotationsOptions,
) {
  const qc = useQueryClient()
  const { resourceId } = target
  const kinds = options?.kinds
  const key = QK(target, kinds)

  const list = useQuery<Annotation[]>({
    queryKey: key,
    queryFn: () => client.list(resourceId, kinds),
    refetchInterval: (query) =>
      hasPendingOcr(query.state.data) ? OCR_POLL_INTERVAL_MS : false,
  })

  const create = useMutation({
    mutationFn: (input: CreateAnnotationInput) =>
      client.create(resourceId, input),
    onSuccess: (created) => {
      // Write the new annotation into the cache synchronously so consumers
      // that immediately open a surface focused on `created.id` (e.g.
      // AnnotationsScope's "open notes surface after save" flow) find it
      // present before any refetch settles. Without this, there's a brief
      // window where the new id isn't in `annotations[]`, which used to trip
      // the dangling-reference guard and close the surface mid-mount.
      qc.setQueryData<Annotation[]>(key, (prev) => {
        const list = prev ?? []
        if (list.some((a) => a.id === created.id)) return list
        return [...list, created]
      })
    },
    onError: (err) =>
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'create',
        meetingDate: resourceId,
      }),
  })

  const updateNote = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      client.updateNote(id, body),
    onSuccess: (updated) => {
      qc.setQueryData<Annotation[]>(key, (prev) =>
        prev?.map((a) => (a.id === updated.id ? updated : a)),
      )
    },
    onError: (err) =>
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'updateNote',
        meetingDate: resourceId,
      }),
  })

  const updateReview = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      client.updateReview(id, body),
    onSuccess: (updated) => {
      qc.setQueryData<Annotation[]>(key, (prev) =>
        prev?.map((a) => (a.id === updated.id ? updated : a)),
      )
    },
    onError: (err) =>
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'updateReview',
        meetingDate: resourceId,
      }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => client.delete(id),
    onSuccess: (_, removedId) => {
      qc.setQueryData<Annotation[]>(key, (prev) =>
        prev?.filter((a) => a.id !== removedId),
      )
    },
    onError: (err) =>
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'remove',
        meetingDate: resourceId,
      }),
  })

  return {
    annotations: list.data ?? [],
    isLoading: list.isLoading,
    create,
    updateNote,
    updateReview,
    remove,
  }
}
