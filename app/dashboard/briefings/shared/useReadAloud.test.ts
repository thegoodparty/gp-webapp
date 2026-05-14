import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useReadAloud } from './useReadAloud'

vi.mock('appEnv', () => ({
  API_ROOT: 'https://api.example.test',
  API_VERSION_PREFIX: '/v1',
}))

const clientRequestMock = vi.fn()
vi.mock('gpApi/typed-request', () => ({
  clientRequest: (...args: unknown[]) => clientRequestMock(...args),
}))

const trackEventMock = vi.fn()
vi.mock('helpers/analyticsHelper', () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
  EVENTS: {
    Briefings: {
      ReadAloudStarted: 'ReadAloudStarted',
      ReadAloudStopped: 'ReadAloudStopped',
      ReadAloudCompleted: 'ReadAloudCompleted',
      ReadAloudFailed: 'ReadAloudFailed',
    },
  },
}))

class MockAudio {
  static instances: MockAudio[] = []
  static reset(): void {
    MockAudio.instances = []
  }

  src = ''
  preload = ''
  paused = true
  loaded = 0
  removed = 0
  playCalls = 0
  onended: (() => void) | null = null
  onerror: (() => void) | null = null

  // Resolver for the next play() call so a test can defer or reject it.
  private nextPlayResult: Promise<void> | null = null

  constructor(src?: string) {
    if (src !== undefined) {
      this.src = src
    }
    MockAudio.instances.push(this)
  }

  play(): Promise<void> {
    this.playCalls += 1
    this.paused = false
    if (this.nextPlayResult) {
      const p = this.nextPlayResult
      this.nextPlayResult = null
      return p
    }
    return Promise.resolve()
  }

  setNextPlayResult(p: Promise<void>): void {
    this.nextPlayResult = p
  }

  pause(): void {
    this.paused = true
  }

  removeAttribute(_attr: string): void {
    this.removed += 1
    this.src = ''
  }

  load(): void {
    this.loaded += 1
  }
}

const target = { type: 'MeetingBriefing' as const, id: '2026-05-14' }

const segment = (id: string, url: string) => ({
  id,
  url,
  durationSeconds: 5,
  characterCount: 100,
})

beforeEach(() => {
  MockAudio.reset()
  clientRequestMock.mockReset()
  trackEventMock.mockReset()
  vi.stubGlobal('Audio', MockAudio)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('useReadAloud', () => {
  it('runs idle -> loading -> playing -> idle on the happy path', async () => {
    clientRequestMock.mockResolvedValue({
      data: {
        segments: [segment('s1', 'https://cdn.test/a.mp3')],
        cacheHit: false,
        voiceId: 'Joanna',
        engine: 'neural',
      },
    })

    const { result } = renderHook(() => useReadAloud({ target }))

    expect(result.current.status).toBe('idle')

    await act(async () => {
      await result.current.play()
    })

    expect(result.current.status).toBe('playing')
    expect(MockAudio.instances).toHaveLength(1)
    expect(MockAudio.instances[0]?.playCalls).toBe(1)

    // Simulate the lone segment finishing playback.
    act(() => {
      MockAudio.instances[0]?.onended?.()
    })

    expect(result.current.status).toBe('idle')
    expect(trackEventMock).toHaveBeenCalledWith(
      'ReadAloudCompleted',
      expect.objectContaining({ targetType: target.type, targetId: target.id }),
    )
  })

  it('transitions to error state when the synthesize request rejects', async () => {
    clientRequestMock.mockRejectedValue(new Error('Boom'))
    const { result } = renderHook(() => useReadAloud({ target }))

    await act(async () => {
      await result.current.play()
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Boom')
    expect(trackEventMock).toHaveBeenCalledWith(
      'ReadAloudFailed',
      expect.objectContaining({ reason: 'synthesize_failed' }),
    )
  })

  it('transitions to error state when the underlying audio errors', async () => {
    clientRequestMock.mockResolvedValue({
      data: {
        segments: [segment('s1', 'https://cdn.test/a.mp3')],
        cacheHit: false,
        voiceId: 'Joanna',
        engine: 'neural',
      },
    })
    const { result } = renderHook(() => useReadAloud({ target }))

    await act(async () => {
      await result.current.play()
    })

    act(() => {
      MockAudio.instances[0]?.onerror?.()
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Audio playback failed')
    expect(trackEventMock).toHaveBeenCalledWith(
      'ReadAloudFailed',
      expect.objectContaining({ reason: 'audio_error' }),
    )
  })

  it('stop() while playing pauses audio and returns to idle', async () => {
    clientRequestMock.mockResolvedValue({
      data: {
        segments: [
          segment('s1', 'https://cdn.test/a.mp3'),
          segment('s2', 'https://cdn.test/b.mp3'),
        ],
        cacheHit: false,
        voiceId: 'Joanna',
        engine: 'neural',
      },
    })
    const { result } = renderHook(() => useReadAloud({ target }))

    await act(async () => {
      await result.current.play()
    })
    expect(result.current.status).toBe('playing')
    const audio = MockAudio.instances[0]!
    expect(audio.paused).toBe(false)

    act(() => {
      result.current.stop()
    })

    expect(result.current.status).toBe('idle')
    expect(audio.paused).toBe(true)
    expect(trackEventMock).toHaveBeenCalledWith(
      'ReadAloudStopped',
      expect.objectContaining({ atSegmentIndex: 0, totalSegments: 2 }),
    )
  })

  it('stays idle when the API returns zero segments', async () => {
    clientRequestMock.mockResolvedValue({
      data: {
        segments: [],
        cacheHit: false,
        voiceId: 'Joanna',
        engine: 'neural',
      },
    })
    const { result } = renderHook(() => useReadAloud({ target }))

    await act(async () => {
      await result.current.play()
    })

    expect(result.current.status).toBe('idle')
    expect(MockAudio.instances).toHaveLength(0)
  })

  it('cleans up the active audio element on unmount', async () => {
    clientRequestMock.mockResolvedValue({
      data: {
        segments: [segment('s1', 'https://cdn.test/a.mp3')],
        cacheHit: false,
        voiceId: 'Joanna',
        engine: 'neural',
      },
    })
    const { result, unmount } = renderHook(() => useReadAloud({ target }))

    await act(async () => {
      await result.current.play()
    })
    const audio = MockAudio.instances[0]!
    expect(audio.paused).toBe(false)

    unmount()

    expect(audio.paused).toBe(true)
    expect(audio.removed).toBeGreaterThan(0)
  })

  it('Stop -> Play during an in-flight synthesize call cancels the stale playback (generation race)', async () => {
    // First call hangs until we resolve it manually; second call resolves immediately.
    let resolveFirst!: (value: unknown) => void
    const firstPromise = new Promise((resolve) => {
      resolveFirst = resolve
    })
    clientRequestMock
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce({
        data: {
          segments: [segment('s2', 'https://cdn.test/second.mp3')],
          cacheHit: false,
          voiceId: 'Joanna',
          engine: 'neural',
        },
      })

    const { result } = renderHook(() => useReadAloud({ target }))

    // Kick off the first play — it will hang on the API response.
    let firstPlay: Promise<void>
    act(() => {
      firstPlay = result.current.play()
    })
    expect(result.current.status).toBe('loading')

    // Stop, then immediately Play again before the first response arrives.
    act(() => {
      result.current.stop()
    })
    let secondPlay: Promise<void>
    await act(async () => {
      secondPlay = result.current.play()
      await secondPlay
    })

    // Now resolve the FIRST request — the stale generation must NOT touch state.
    await act(async () => {
      resolveFirst({
        data: {
          segments: [segment('s1', 'https://cdn.test/first.mp3')],
          cacheHit: false,
          voiceId: 'Joanna',
          engine: 'neural',
        },
      })
      await firstPlay
      await flush()
    })

    // Exactly one Audio instance from the second call should exist (and be playing it).
    const playingAudios = MockAudio.instances.filter(
      (a) => a.src === 'https://cdn.test/second.mp3',
    )
    const staleAudios = MockAudio.instances.filter(
      (a) => a.src === 'https://cdn.test/first.mp3',
    )
    expect(playingAudios).toHaveLength(1)
    expect(staleAudios).toHaveLength(0)
    expect(result.current.status).toBe('playing')
  })

  it('Play -> Play (rapid double tap) does not leave two playback cursors running', async () => {
    let resolveFirst!: (value: unknown) => void
    const firstPromise = new Promise((resolve) => {
      resolveFirst = resolve
    })
    clientRequestMock
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce({
        data: {
          segments: [segment('s2', 'https://cdn.test/second.mp3')],
          cacheHit: false,
          voiceId: 'Joanna',
          engine: 'neural',
        },
      })

    const { result } = renderHook(() => useReadAloud({ target }))

    let firstPlay: Promise<void>
    act(() => {
      firstPlay = result.current.play()
    })

    let secondPlay: Promise<void>
    await act(async () => {
      secondPlay = result.current.play()
      await secondPlay
    })

    await act(async () => {
      resolveFirst({
        data: {
          segments: [segment('s1', 'https://cdn.test/first.mp3')],
          cacheHit: false,
          voiceId: 'Joanna',
          engine: 'neural',
        },
      })
      await firstPlay
      await flush()
    })

    const cursorsForFirst = MockAudio.instances.filter(
      (a) => a.src === 'https://cdn.test/first.mp3' && a.playCalls > 0,
    )
    const cursorsForSecond = MockAudio.instances.filter(
      (a) => a.src === 'https://cdn.test/second.mp3' && a.playCalls > 0,
    )
    // The stale first response must not start playback.
    expect(cursorsForFirst).toHaveLength(0)
    expect(cursorsForSecond).toHaveLength(1)
  })
})
