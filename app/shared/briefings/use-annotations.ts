'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { annotationsApi } from './annotations-api'
import type { AnnotationsClient } from './annotations-client'
import type { Annotation, CreateAnnotationInput } from './types'

const QK = (briefingId: string) => ['briefings', briefingId, 'annotations']

/**
 * TanStack Query wrapper over the AnnotationsClient.
 *
 * Bound to the real gp-api client. The localStorage stub
 * (`annotations-stub.ts`) is still available for development against
 * fixtures by swapping the import below.
 */
const client: AnnotationsClient = annotationsApi

export function useAnnotations(briefingId: string) {
  const qc = useQueryClient()

  const list = useQuery<Annotation[]>({
    queryKey: QK(briefingId),
    queryFn: () => client.list(briefingId),
  })

  const create = useMutation({
    mutationFn: (input: CreateAnnotationInput) =>
      client.create(briefingId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK(briefingId) })
    },
  })

  const updateNote = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      client.updateNote(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK(briefingId) })
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => client.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK(briefingId) })
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
