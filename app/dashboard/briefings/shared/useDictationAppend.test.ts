import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { DictationStatus, UseDictationResult } from './useDictation'

type DictationInputCapture = {
  onFinalTranscript?: (text: string) => void
  analyticsLabel?: string
}

let lastInput: DictationInputCapture | null = null
const mockStart = vi.fn(async () => undefined)
const mockStop = vi.fn(async () => undefined)
const mockState: {
  status: DictationStatus
  error: string | null
  partialTranscript: string
} = {
  status: 'idle',
  error: null,
  partialTranscript: '',
}

vi.mock('./useDictation', () => ({
  useDictation: (input: DictationInputCapture): UseDictationResult => {
    lastInput = input
    return {
      status: mockState.status,
      error: mockState.error,
      transcript: '',
      partialTranscript: mockState.partialTranscript,
      warningSecondsRemaining: null,
      start: mockStart,
      stop: mockStop,
    }
  },
}))

import { useDictationAppend } from './useDictationAppend'

beforeEach(() => {
  lastInput = null
  mockStart.mockClear()
  mockStop.mockClear()
  mockState.status = 'idle'
  mockState.error = null
  mockState.partialTranscript = ''
})

describe('useDictationAppend', () => {
  it('forwards analyticsLabel to useDictation', () => {
    const onChange = vi.fn()
    renderHook(() =>
      useDictationAppend({
        analyticsLabel: 'my_surface',
        value: '',
        onChange,
      }),
    )
    expect(lastInput?.analyticsLabel).toBe('my_surface')
  })

  it('exposes status / error / partialTranscript from useDictation', () => {
    mockState.status = 'recording'
    mockState.error = 'oops'
    mockState.partialTranscript = 'hello there'
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useDictationAppend({ analyticsLabel: 's', value: '', onChange }),
    )
    expect(result.current.status).toBe('recording')
    expect(result.current.error).toBe('oops')
    expect(result.current.partialTranscript).toBe('hello there')
  })

  it('reports active=true for all active statuses', () => {
    const onChange = vi.fn()
    const activeStatuses: DictationStatus[] = [
      'requesting_mic',
      'connecting',
      'recording',
      'stopping',
    ]
    for (const status of activeStatuses) {
      mockState.status = status
      const { result, unmount } = renderHook(() =>
        useDictationAppend({ analyticsLabel: 's', value: '', onChange }),
      )
      expect(result.current.active).toBe(true)
      unmount()
    }
  })

  it('reports active=false for idle and error', () => {
    const onChange = vi.fn()
    for (const status of ['idle', 'error'] as DictationStatus[]) {
      mockState.status = status
      const { result, unmount } = renderHook(() =>
        useDictationAppend({ analyticsLabel: 's', value: '', onChange }),
      )
      expect(result.current.active).toBe(false)
      unmount()
    }
  })

  it('reports busy=true for non-recording active statuses (requesting_mic, connecting, stopping)', () => {
    const onChange = vi.fn()
    for (const status of [
      'requesting_mic',
      'connecting',
      'stopping',
    ] as DictationStatus[]) {
      mockState.status = status
      const { result, unmount } = renderHook(() =>
        useDictationAppend({ analyticsLabel: 's', value: '', onChange }),
      )
      expect(result.current.busy).toBe(true)
      unmount()
    }
  })

  it('reports busy=false for recording, idle, error', () => {
    const onChange = vi.fn()
    for (const status of ['recording', 'idle', 'error'] as DictationStatus[]) {
      mockState.status = status
      const { result, unmount } = renderHook(() =>
        useDictationAppend({ analyticsLabel: 's', value: '', onChange }),
      )
      expect(result.current.busy).toBe(false)
      unmount()
    }
  })

  it('toggle() calls start() when not active', async () => {
    const onChange = vi.fn()
    mockState.status = 'idle'
    const { result } = renderHook(() =>
      useDictationAppend({ analyticsLabel: 's', value: '', onChange }),
    )
    await act(async () => {
      await result.current.toggle()
    })
    expect(mockStart).toHaveBeenCalledTimes(1)
    expect(mockStop).not.toHaveBeenCalled()
  })

  it('toggle() calls stop() when active (recording)', async () => {
    const onChange = vi.fn()
    mockState.status = 'recording'
    const { result } = renderHook(() =>
      useDictationAppend({ analyticsLabel: 's', value: '', onChange }),
    )
    await act(async () => {
      await result.current.toggle()
    })
    expect(mockStop).toHaveBeenCalledTimes(1)
    expect(mockStart).not.toHaveBeenCalled()
  })

  it('on final transcript appends to value with a separator when value is non-empty and does not end in space', () => {
    const onChange = vi.fn()
    renderHook(() =>
      useDictationAppend({
        analyticsLabel: 's',
        value: 'hello',
        onChange,
      }),
    )
    act(() => {
      lastInput?.onFinalTranscript?.('world')
    })
    expect(onChange).toHaveBeenCalledWith('hello world')
  })

  it('does not insert a separator when value already ends with a space', () => {
    const onChange = vi.fn()
    renderHook(() =>
      useDictationAppend({
        analyticsLabel: 's',
        value: 'hello ',
        onChange,
      }),
    )
    act(() => {
      lastInput?.onFinalTranscript?.('world')
    })
    expect(onChange).toHaveBeenCalledWith('hello world')
  })

  it('uses the latest value when onFinalTranscript fires after a prop update (no stale closure)', () => {
    const onChange = vi.fn()
    const { rerender } = renderHook(
      ({ value }: { value: string }) =>
        useDictationAppend({ analyticsLabel: 's', value, onChange }),
      { initialProps: { value: 'first' } },
    )
    rerender({ value: 'updated' })
    act(() => {
      lastInput?.onFinalTranscript?.('text')
    })
    expect(onChange).toHaveBeenCalledWith('updated text')
  })

  it('skips onChange when the final transcript is empty', () => {
    const onChange = vi.fn()
    renderHook(() =>
      useDictationAppend({ analyticsLabel: 's', value: 'hello', onChange }),
    )
    act(() => {
      lastInput?.onFinalTranscript?.('')
    })
    expect(onChange).not.toHaveBeenCalled()
  })
})
