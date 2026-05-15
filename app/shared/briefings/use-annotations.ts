'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { annotationsApi } from './annotations-api'
import type { AnnotationsClient } from './annotations-client'
import type { Annotation, CreateAnnotationInput } from './types'

const QK = (meetingDate: string) => ['briefings', meetingDate, 'annotations']

/**
 * TanStack Query wrapper over the AnnotationsClient.
 *
 * Bound to the real gp-api client. The localStorage stub
 * (`annotations-stub.ts`) is still available for development against
 * fixtures by swapping the import below.
 *
 * `meetingDate` is the YYYY-MM-DD slug that addresses the briefing in
 * `GET /v1/meetings/:date/briefing`; annotations endpoints nest under the
 * same shape.
 */
const client: AnnotationsClient = annotationsApi

export function useAnnotations(meetingDate: string) {
  const qc = useQueryClient()

  const list = useQuery<Annotation[]>({
    queryKey: QK(meetingDate),
    queryFn: () => client.list(meetingDate),
  })

  const create = useMutation({
    mutationFn: (input: CreateAnnotationInput) =>
      client.create(meetingDate, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK(meetingDate) })
    },
  })

  const updateNote = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      client.updateNote(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK(meetingDate) })
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => client.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK(meetingDate) })
    },
  })

  return {
    annotations: list.data ?? [],
    isLoading: list.isLoading,
    create,
    updateNote,
    remove,
  }
}
