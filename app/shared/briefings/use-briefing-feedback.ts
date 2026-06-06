'use client'

import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
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

  const commentByItemId = useMemo(() => {
    // `undefined` = no row for this item; `null` = row exists with no
    // comment; string = stored comment. The composer needs the
    // distinction so it knows whether to prefill the textarea.
    const map: Record<string, string | null | undefined> = {}
    for (const row of list.data ?? []) {
      map[row.artifactId] = row.comment
    }
    return map
  }, [list.data])

  const setMutation = useMutation({
    mutationFn: ({
      itemId,
      feedback,
      comment,
    }: {
      itemId: string
      feedback: ArtifactFeedbackKind
      // `undefined` preserves the existing comment; `null` clears it;
      // string replaces it. Mirrors the API contract.
      comment?: string | null
    }) => briefingFeedbackApi.set(meetingDate, itemId, feedback, comment),
    onMutate: async ({ itemId, feedback, comment }) => {
      await qc.cancelQueries({ queryKey })
      const previous = qc.getQueryData<ArtifactFeedback[]>(queryKey) ?? []
      const others = previous.filter((row) => row.artifactId !== itemId)
      const existing = previous.find((row) => row.artifactId === itemId)
      const now = new Date().toISOString()
      // Match the server's `undefined = preserve, null/string = overwrite`
      // contract in the optimistic copy so the UI doesn't briefly show a
      // wrong comment value mid-mutation.
      const nextComment =
        comment === undefined ? (existing?.comment ?? null) : comment
      const next: ArtifactFeedback[] = [
        ...others,
        existing
          ? { ...existing, feedback, comment: nextComment, updatedAt: now }
          : {
              id: `optimistic-${itemId}`,
              organizationSlug: '',
              submitterUserId: -1,
              artifactId: itemId,
              feedback,
              comment: nextComment,
              createdAt: now,
              updatedAt: now,
            },
      ]
      qc.setQueryData<ArtifactFeedback[]>(queryKey, next)
      return { previous }
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKey, ctx.previous)
      }
      trackEvent(EVENTS.BriefingAssistant.FeedbackSubmissionFailed, {
        meetingDate,
        itemId: vars.itemId,
        feedback: vars.feedback === 'positive' ? 'good' : 'bad',
        operation: 'set',
      })
    },
    onSettled: async () => {
      await qc.cancelQueries({ queryKey })
      await qc.invalidateQueries({ queryKey })
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
    onError: (_err, itemId, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKey, ctx.previous)
      }
      trackEvent(EVENTS.BriefingAssistant.FeedbackSubmissionFailed, {
        meetingDate,
        itemId,
        operation: 'clear',
      })
    },
    onSettled: async () => {
      await qc.cancelQueries({ queryKey })
      await qc.invalidateQueries({ queryKey })
    },
  })

  const setFeedbackMutate = setMutation.mutate
  const clearFeedbackMutate = clearMutation.mutate

  const setFeedback = useCallback(
    (itemId: string, feedback: ArtifactFeedbackKind, comment?: string | null) =>
      setFeedbackMutate({ itemId, feedback, comment }),
    [setFeedbackMutate],
  )

  const clearFeedback = useCallback(
    (itemId: string) => clearFeedbackMutate(itemId),
    [clearFeedbackMutate],
  )

  return {
    feedbackByItemId,
    commentByItemId,
    isLoading: list.isLoading,
    setFeedback,
    clearFeedback,
  }
}
