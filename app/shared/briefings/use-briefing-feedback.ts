'use client'

import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  briefingFeedbackApi,
  type ArtifactFeedback,
  type ArtifactFeedbackKind,
} from './feedback-api'

const QK = (meetingDate: string) => ['briefings', meetingDate, 'feedback']

export function useBriefingFeedback(meetingDate: string) {
  const qc = useQueryClient()
  const queryKey = QK(meetingDate)

  const list = useQuery<ArtifactFeedback[]>({
    queryKey,
    queryFn: () => briefingFeedbackApi.list(meetingDate),
  })

  const feedbackByItemId = useMemo(() => {
    const map: Record<string, ArtifactFeedbackKind | undefined> = {}
    for (const row of list.data ?? []) {
      map[row.artifactId] = row.feedback
    }
    return map
  }, [list.data])

  const setMutation = useMutation({
    mutationFn: ({
      itemId,
      feedback,
    }: {
      itemId: string
      feedback: ArtifactFeedbackKind
    }) => briefingFeedbackApi.set(meetingDate, itemId, feedback),
    onMutate: async ({ itemId, feedback }) => {
      await qc.cancelQueries({ queryKey })
      const previous = qc.getQueryData<ArtifactFeedback[]>(queryKey) ?? []
      const others = previous.filter((row) => row.artifactId !== itemId)
      const existing = previous.find((row) => row.artifactId === itemId)
      const now = new Date().toISOString()
      const next: ArtifactFeedback[] = [
        ...others,
        existing
          ? { ...existing, feedback, updatedAt: now }
          : {
              id: `optimistic-${itemId}`,
              organizationSlug: '',
              submitterUserId: -1,
              artifactId: itemId,
              feedback,
              createdAt: now,
              updatedAt: now,
            },
      ]
      qc.setQueryData<ArtifactFeedback[]>(queryKey, next)
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKey, ctx.previous)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey })
    },
  })

  const clearMutation = useMutation({
    mutationFn: (itemId: string) =>
      briefingFeedbackApi.clear(meetingDate, itemId),
    onMutate: async (itemId) => {
      await qc.cancelQueries({ queryKey })
      const previous = qc.getQueryData<ArtifactFeedback[]>(queryKey) ?? []
      const next = previous.filter((row) => row.artifactId !== itemId)
      qc.setQueryData<ArtifactFeedback[]>(queryKey, next)
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKey, ctx.previous)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey })
    },
  })

  const setFeedback = useCallback(
    (itemId: string, feedback: ArtifactFeedbackKind) =>
      setMutation.mutate({ itemId, feedback }),
    [setMutation],
  )

  const clearFeedback = useCallback(
    (itemId: string) => clearMutation.mutate(itemId),
    [clearMutation],
  )

  return {
    feedbackByItemId,
    isLoading: list.isLoading,
    setFeedback,
    clearFeedback,
  }
}
