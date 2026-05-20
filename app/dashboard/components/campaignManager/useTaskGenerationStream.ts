'use client'

import { useCallback, useRef, useState } from 'react'
import { API_VERSION_PREFIX } from 'appEnv'
import { getCookie } from 'helpers/cookieHelper'
import {
  ORG_SLUG_COOKIE,
  ORG_SLUG_HEADER,
} from '@shared/organizations/constants'
import type { Task } from '../tasks/TaskItem'

interface TaskGenerationProgress {
  progress: number
  message: string
}

interface TaskGenerationState {
  isGenerating: boolean
  progress: TaskGenerationProgress | null
  error: string | null
}

interface SSEEvent {
  type: 'progress' | 'complete' | 'error'
  progress?: number
  message?: string
  tasks?: Task[]
}

function isSSEEvent(value: unknown): value is SSEEvent {
  if (typeof value !== 'object' || value === null) return false
  if (!('type' in value)) return false
  const { type } = value
  return type === 'progress' || type === 'complete' || type === 'error'
}

function parseSSEEvents(text: string): SSEEvent[] {
  const events: SSEEvent[] = []
  const blocks = text.split('\n\n')
  for (const block of blocks) {
    const dataLine = block.split('\n').find((line) => line.startsWith('data: '))
    if (!dataLine) continue
    try {
      const json: unknown = JSON.parse(dataLine.slice(6))
      if (isSSEEvent(json)) {
        events.push(json)
      }
    } catch {
      // skip malformed events
    }
  }
  return events
}

export function useTaskGenerationStream(
  onTasksReceived: (tasks: Task[]) => void,
) {
  const [state, setState] = useState<TaskGenerationState>({
    isGenerating: false,
    progress: null,
    error: null,
  })
  const abortRef = useRef<AbortController | null>(null)

  const cancelGeneration = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setState({ isGenerating: false, progress: null, error: null })
  }, [])

  const startGeneration = useCallback(async () => {
    if (abortRef.current) return

    const controller = new AbortController()
    abortRef.current = controller

    setState({ isGenerating: true, progress: null, error: null })

    try {
      const url = `/api${API_VERSION_PREFIX}/campaigns/tasks/generate/stream`
      const orgSlug = getCookie(ORG_SLUG_COOKIE)
      const response = await fetch(url, {
        credentials: 'include',
        signal: controller.signal,
        headers: {
          Accept: 'text/event-stream',
          ...(orgSlug && { [ORG_SLUG_HEADER]: orgSlug }),
        },
      })

      if (!response.ok || !response.body) {
        throw new Error(`Stream request failed: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let generationFinished = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lastComplete = buffer.lastIndexOf('\n\n')
        if (lastComplete < 0) continue

        const completePortion = buffer.slice(0, lastComplete + 2)
        buffer = buffer.slice(lastComplete + 2)

        const events = parseSSEEvents(completePortion)

        for (const event of events) {
          if (event.type === 'progress') {
            setState((prev) => ({
              ...prev,
              progress: {
                progress: event.progress ?? 0,
                message: event.message ?? '',
              },
            }))
          } else if (event.type === 'complete' && event.tasks) {
            generationFinished = true
            onTasksReceived(event.tasks)
            setState({
              isGenerating: false,
              progress: null,
              error: null,
            })
          } else if (event.type === 'error') {
            generationFinished = true
            setState({
              isGenerating: false,
              progress: null,
              error: event.message ?? 'Generation failed',
            })
          }
        }
      }

      if (!generationFinished) {
        setState({
          isGenerating: false,
          progress: null,
          error: 'Stream ended before completing task generation',
        })
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setState({
          isGenerating: false,
          progress: null,
          error: null,
        })
      } else {
        setState({
          isGenerating: false,
          progress: null,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    } finally {
      abortRef.current = null
    }
  }, [onTasksReceived])

  return {
    ...state,
    startGeneration,
    cancelGeneration,
  }
}
