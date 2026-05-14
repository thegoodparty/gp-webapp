'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { annotationsStub } from './annotations-stub'
import type { Annotation, CreateAnnotationInput } from './types'

const QK = (briefingId: string) => ['briefings', briefingId, 'annotations']

/**
 * TanStack Query wrapper over the AnnotationsClient. Currently bound to the
 * localStorage stub. Swap the import to the real API client (to be added in
 * phase 8) to point at gp-api.
 */
export function useAnnotations(briefingId: string) {
  const qc = useQueryClient()

  const list = useQuery<Annotation[]>({
    queryKey: QK(briefingId),
    queryFn: () => annotationsStub.list(briefingId),
  })

  const create = useMutation({
    mutationFn: (input: CreateAnnotationInput) =>
      annotationsStub.create(briefingId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK(briefingId) })
    },
  })

  const updateNote = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      annotationsStub.updateNote(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK(briefingId) })
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => annotationsStub.delete(id),
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
