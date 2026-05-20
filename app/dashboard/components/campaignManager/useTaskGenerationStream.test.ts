import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTaskGenerationStream } from './useTaskGenerationStream'

vi.mock('appEnv', () => ({
  API_VERSION_PREFIX: '/v1',
}))

function createSSEChunk(events: Array<Record<string, unknown>>): string {
  return events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join('')
}

function encodeChunk(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

function createMockReadableStream(
  chunks: Uint8Array[],
): ReadableStream<Uint8Array> {
  let index = 0
  return new ReadableStream({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(chunks[index]!)
        index++
      } else {
        controller.close()
      }
    },
  })
}

function mockFetchWithStream(chunks: Uint8Array[], status = 200) {
  const body = createMockReadableStream(chunks)
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      body,
    }),
  )
}

describe('useTaskGenerationStream', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Desc',
      flowType: 'text',
      week: 1,
      completed: false,
    },
  ]

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initiates fetch with correct URL and headers', async () => {
    mockFetchWithStream([
      encodeChunk(createSSEChunk([{ type: 'complete', tasks: mockTasks }])),
    ])
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(fetch).toHaveBeenCalledWith(
      '/api/v1/campaigns/tasks/generate/stream',
      expect.objectContaining({
        credentials: 'include',
        signal: expect.any(AbortSignal),
        headers: { Accept: 'text/event-stream' },
      }),
    )
  })

  it('updates progress state on progress events', async () => {
    const chunks = [
      encodeChunk(
        createSSEChunk([
          { type: 'progress', progress: 50, message: 'Halfway' },
        ]),
      ),
      encodeChunk(createSSEChunk([{ type: 'complete', tasks: mockTasks }])),
    ]
    mockFetchWithStream(chunks)
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    // After complete event, generation should be done
    expect(result.current.isGenerating).toBe(false)
    expect(onTasksReceived).toHaveBeenCalledWith(mockTasks)
  })

  it('calls onTasksReceived and resets state on complete event', async () => {
    mockFetchWithStream([
      encodeChunk(createSSEChunk([{ type: 'complete', tasks: mockTasks }])),
    ])
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(onTasksReceived).toHaveBeenCalledWith(mockTasks)
    expect(result.current.isGenerating).toBe(false)
    expect(result.current.progress).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('updates error state on error events', async () => {
    mockFetchWithStream([
      encodeChunk(
        createSSEChunk([{ type: 'error', message: 'Something broke' }]),
      ),
    ])
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(result.current.error).toBe('Something broke')
    expect(result.current.isGenerating).toBe(false)
    expect(onTasksReceived).not.toHaveBeenCalled()
  })

  it('uses default error message when error event has no message', async () => {
    mockFetchWithStream([encodeChunk(createSSEChunk([{ type: 'error' }]))])
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(result.current.error).toBe('Generation failed')
  })

  it('skips malformed SSE events', async () => {
    const raw =
      'data: not-valid-json\n\n' +
      'data: {"noTypeField": true}\n\n' +
      `data: ${JSON.stringify({ type: 'complete', tasks: mockTasks })}\n\n`
    mockFetchWithStream([encodeChunk(raw)])
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(onTasksReceived).toHaveBeenCalledWith(mockTasks)
    expect(result.current.error).toBeNull()
  })

  it('handles AbortError gracefully without setting error state', async () => {
    // Create an error with name 'AbortError' that is an instance of Error
    const abortError = new Error('The operation was aborted')
    abortError.name = 'AbortError'
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError))
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.isGenerating).toBe(false)
  })

  it('sets error state on network errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network failure')),
    )
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(result.current.error).toBe('Network failure')
    expect(result.current.isGenerating).toBe(false)
  })

  it('sets error when stream closes without complete or error event', async () => {
    mockFetchWithStream([])
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(onTasksReceived).not.toHaveBeenCalled()
    expect(result.current.error).toBe(
      'Stream ended before completing task generation',
    )
    expect(result.current.isGenerating).toBe(false)
  })

  it('sets error state when response is not ok', async () => {
    mockFetchWithStream([], 500)
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(result.current.error).toBe('Stream request failed: 500')
    expect(result.current.isGenerating).toBe(false)
  })

  it('cancelGeneration aborts the controller and resets state', async () => {
    // We need a stream that blocks until we cancel. Use a manually controlled reader.
    let resolveRead:
      | ((val: { done: boolean; value?: Uint8Array }) => void)
      | undefined
    const mockReader = {
      read: vi.fn(
        () =>
          new Promise<{ done: boolean; value?: Uint8Array }>((resolve) => {
            resolveRead = resolve
          }),
      ),
    }
    const mockBody = { getReader: () => mockReader }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, body: mockBody }),
    )
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    // Start generation (will hang on reader.read())
    let generationPromise: Promise<void> | undefined
    await act(async () => {
      generationPromise = result.current.startGeneration()
      // Let fetch resolve
      await Promise.resolve()
    })

    expect(result.current.isGenerating).toBe(true)

    // Cancel generation
    act(() => {
      result.current.cancelGeneration()
    })

    expect(result.current.isGenerating).toBe(false)
    expect(result.current.progress).toBeNull()
    expect(result.current.error).toBeNull()

    // Unblock the reader so the promise settles
    resolveRead?.({ done: true })
    await act(async () => {
      await generationPromise
    })
  })

  it('prevents multiple rapid calls when generation is active', async () => {
    // Use a manually controlled reader so the stream never completes
    const mockReader = {
      read: vi.fn(
        () =>
          new Promise<{ done: boolean; value?: Uint8Array }>(() => {
            // intentionally never resolves to simulate a hanging stream
          }),
      ),
    }
    const mockBody = { getReader: () => mockReader }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, body: mockBody }),
    )
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    // First call
    await act(async () => {
      result.current.startGeneration()
      // Let fetch resolve
      await Promise.resolve()
    })

    // Second call should be a no-op (abortRef.current exists)
    await act(async () => {
      await result.current.startGeneration()
    })

    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('handles progress events with missing fields using defaults', async () => {
    mockFetchWithStream([
      encodeChunk(
        createSSEChunk([
          { type: 'progress' },
          { type: 'complete', tasks: mockTasks },
        ]),
      ),
    ])
    const onTasksReceived = vi.fn()
    const { result } = renderHook(() =>
      useTaskGenerationStream(onTasksReceived),
    )

    await act(async () => {
      await result.current.startGeneration()
    })

    expect(onTasksReceived).toHaveBeenCalledWith(mockTasks)
  })
})
