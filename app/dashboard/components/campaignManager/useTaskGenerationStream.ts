'use client'

import { useCallback, useRef, useState } from 'react'
import { API_VERSION_PREFIX } from 'appEnv'
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

function parseSSEEvents(text: string): SSEEvent[] {
  const events: SSEEvent[] = []
  const blocks = text.split('\n\n')
  for (const block of blocks) {
    const dataLine = block.split('\n').find((line) => line.startsWith('data: '))
    if (!dataLine) continue
    try {
      const json = JSON.parse(dataLine.slice(6)) as SSEEvent
      events.push(json)
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

  const startGeneration = useCallback(async () => {
    if (abortRef.current) return

    const controller = new AbortController()
    abortRef.current = controller

    setState({ isGenerating: true, progress: null, error: null })

    try {
      const url = `/api${API_VERSION_PREFIX}/campaigns/tasks/generate/stream`
      const response = await fetch(url, {
        credentials: 'include',
        signal: controller.signal,
        headers: { Accept: 'text/event-stream' },
      })

      if (!response.ok || !response.body) {
        throw new Error(`Stream request failed: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const events = parseSSEEvents(buffer)
        const lastComplete = buffer.lastIndexOf('\n\n')
        if (lastComplete >= 0) {
          buffer = buffer.slice(lastComplete + 2)
        }

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
            onTasksReceived(event.tasks)
            setState({
              isGenerating: false,
              progress: null,
              error: null,
            })
          } else if (event.type === 'error') {
            setState({
              isGenerating: false,
              progress: null,
              error: event.message ?? 'Generation failed',
            })
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setState({
          isGenerating: false,
          progress: null,
          error: String(err),
        })
      }
    } finally {
      abortRef.current = null
    }
  }, [onTasksReceived])

  const cancelGeneration = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setState({ isGenerating: false, progress: null, error: null })
  }, [])

  return {
    ...state,
    startGeneration,
    cancelGeneration,
  }
}
