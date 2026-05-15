import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDictation } from './useDictation'

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
      DictationStarted: 'DictationStarted',
      DictationStopped: 'DictationStopped',
      DictationFailed: 'DictationFailed',
      DictationMaxDurationReached: 'DictationMaxDurationReached',
    },
  },
}))

class MockMediaStreamTrack {
  stopped = 0
  stop(): void {
    this.stopped += 1
  }
}

class MockMediaStream {
  static instances: MockMediaStream[] = []
  static reset(): void {
    MockMediaStream.instances = []
  }

  tracks: MockMediaStreamTrack[]
  constructor() {
    this.tracks = [new MockMediaStreamTrack()]
    MockMediaStream.instances.push(this)
  }
  getTracks(): MockMediaStreamTrack[] {
    return this.tracks
  }
}

class MockWebSocket {
  static OPEN = 1
  static CONNECTING = 0
  static CLOSING = 2
  static CLOSED = 3

  static instances: MockWebSocket[] = []
  static reset(): void {
    MockWebSocket.instances = []
  }

  url: string
  readyState: number = MockWebSocket.CONNECTING
  binaryType = 'blob'
  sent: unknown[] = []
  closed = 0

  onopen: (() => void | Promise<void>) | null = null
  onmessage: ((event: { data: unknown }) => void) | null = null
  onerror: (() => void) | null = null
  onclose: (() => void) | null = null

  constructor(url: string) {
    this.url = url
    MockWebSocket.instances.push(this)
  }

  send(data: unknown): void {
    this.sent.push(data)
  }

  close(): void {
    this.closed += 1
    this.readyState = MockWebSocket.CLOSED
  }

  // Test helpers
  async open(): Promise<void> {
    this.readyState = MockWebSocket.OPEN
    if (this.onopen) {
      await this.onopen()
    }
  }

  emitMessage(data: unknown): void {
    this.onmessage?.({ data })
  }

  emitError(): void {
    this.onerror?.()
  }

  emitClose(): void {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.()
  }
}

class MockAudioWorklet {
  modules: string[] = []
  resolveAddModule: (() => void) | null = null
  pendingAddModule: Promise<void> | null = null

  addModule(path: string): Promise<void> {
    this.modules.push(path)
    if (this.pendingAddModule) {
      return this.pendingAddModule
    }
    return Promise.resolve()
  }

  // Cause the next addModule call to hang until released by the test.
  deferNext(): () => void {
    this.pendingAddModule = new Promise<void>((resolve) => {
      this.resolveAddModule = resolve
    })
    return () => {
      this.resolveAddModule?.()
      this.pendingAddModule = null
      this.resolveAddModule = null
    }
  }
}

class MockAudioContext {
  static instances: MockAudioContext[] = []
  static reset(): void {
    MockAudioContext.instances = []
  }

  audioWorklet = new MockAudioWorklet()
  destination = {}
  closed = 0
  sources: unknown[] = []

  constructor(_options?: unknown) {
    MockAudioContext.instances.push(this)
  }

  createMediaStreamSource(_stream: unknown): {
    connect: () => void
    disconnect: () => void
  } {
    const node = {
      connect: () => undefined,
      disconnect: () => undefined,
    }
    this.sources.push(node)
    return node
  }

  close(): Promise<void> {
    this.closed += 1
    return Promise.resolve()
  }
}

class MockAudioWorkletNode {
  port = {
    onmessage: null as ((event: { data: unknown }) => void) | null,
  }
  disconnected = 0
  connectCalls = 0

  connect(): void {
    this.connectCalls += 1
  }
  disconnect(): void {
    this.disconnected += 1
  }
}

const ANALYTICS_LABEL = 'dictation_demo'

const setupNavigator = (
  getUserMedia:
    | ((constraints: unknown) => Promise<MockMediaStream>)
    | (() => Promise<never>) = () => Promise.resolve(new MockMediaStream()),
): void => {
  Object.defineProperty(global.navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia: vi.fn(getUserMedia) },
  })
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

beforeEach(() => {
  MockWebSocket.reset()
  MockAudioContext.reset()
  MockMediaStream.reset()
  clientRequestMock.mockReset()
  trackEventMock.mockReset()
  vi.stubGlobal('WebSocket', MockWebSocket)
  vi.stubGlobal('AudioContext', MockAudioContext)
  vi.stubGlobal('AudioWorkletNode', MockAudioWorkletNode)
  setupNavigator()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const happyPathSession = () =>
  clientRequestMock.mockResolvedValue({
    data: {
      sessionId: 'sess-1',
      wsUrl: '/v1/speech/transcribe/stream?ticket=t',
      maxDurationSeconds: 600,
    },
  })

describe('useDictation', () => {
  it('sends an empty body to the session endpoint (pure pipe)', async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
    })

    expect(clientRequestMock).toHaveBeenCalledWith(
      'POST /v1/speech/transcribe/session',
      {},
    )
    const body = clientRequestMock.mock.calls[0]?.[1] as Record<string, unknown>
    expect(body).not.toHaveProperty('target')
  })

  it('start() while busy is a no-op', async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
    })
    // Bring the socket open and ready so we are firmly 'recording'.
    await act(async () => {
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })
    expect(result.current.status).toBe('recording')

    const wsCount = MockWebSocket.instances.length
    const sessionCalls = clientRequestMock.mock.calls.length

    await act(async () => {
      await result.current.start()
    })
    expect(MockWebSocket.instances).toHaveLength(wsCount)
    expect(clientRequestMock.mock.calls).toHaveLength(sessionCalls)
  })

  it('getUserMedia rejection moves to error', async () => {
    setupNavigator(() => Promise.reject(new Error('Mic denied')))
    happyPathSession()
    const { result } = renderHook(() =>
      useDictation({ analyticsLabel: ANALYTICS_LABEL }),
    )

    await act(async () => {
      await result.current.start()
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Mic denied')
    expect(trackEventMock).toHaveBeenCalledWith(
      'DictationFailed',
      expect.objectContaining({
        code: 'MIC_DENIED',
        label: ANALYTICS_LABEL,
      }),
    )
    expect(MockWebSocket.instances).toHaveLength(0)
  })

  it('session API failure moves to error and tears down mic', async () => {
    clientRequestMock.mockRejectedValue(new Error('500'))
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('500')
    expect(trackEventMock).toHaveBeenCalledWith(
      'DictationFailed',
      expect.objectContaining({ code: 'SESSION_FAILED' }),
    )
  })

  it('WebSocket onerror moves to error', async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
    })
    await act(async () => {
      MockWebSocket.instances[0]?.emitError()
    })

    expect(result.current.status).toBe('error')
    expect(trackEventMock).toHaveBeenCalledWith(
      'DictationFailed',
      expect.objectContaining({ code: 'WS_ERROR' }),
    )
  })

  it('server "closed" event returns the hook to idle', async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })
    expect(result.current.status).toBe('recording')

    await act(async () => {
      MockWebSocket.instances[0]?.emitMessage(
        JSON.stringify({ type: 'closed', reason: 'server' }),
      )
    })
    expect(result.current.status).toBe('idle')
  })

  it('stop() while idle or in error is a no-op', async () => {
    const { result } = renderHook(() => useDictation())
    expect(result.current.status).toBe('idle')

    await act(async () => {
      await result.current.stop()
    })
    expect(result.current.status).toBe('idle')
    expect(trackEventMock).not.toHaveBeenCalled()
  })

  it('unmount during recording calls teardown', async () => {
    happyPathSession()
    const { result, unmount } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })
    expect(MockAudioContext.instances).toHaveLength(1)

    unmount()

    expect(MockWebSocket.instances[0]?.closed).toBeGreaterThanOrEqual(1)
    expect(MockAudioContext.instances[0]?.closed).toBeGreaterThanOrEqual(1)
  })

  it('handles partial and final transcripts and forwards callbacks', async () => {
    happyPathSession()
    const onPartial = vi.fn()
    const onFinal = vi.fn()
    const { result } = renderHook(() =>
      useDictation({
        onPartialTranscript: onPartial,
        onFinalTranscript: onFinal,
      }),
    )

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })

    await act(async () => {
      MockWebSocket.instances[0]?.emitMessage(
        JSON.stringify({
          type: 'transcript',
          isPartial: true,
          text: 'hello',
        }),
      )
    })
    expect(result.current.partialTranscript).toBe('hello')
    expect(onPartial).toHaveBeenCalledWith('hello')

    await act(async () => {
      MockWebSocket.instances[0]?.emitMessage(
        JSON.stringify({
          type: 'transcript',
          isPartial: false,
          text: 'hello world',
        }),
      )
    })
    expect(result.current.transcript).toBe('hello world')
    expect(result.current.partialTranscript).toBe('')
    expect(onFinal).toHaveBeenCalledWith('hello world')
  })

  it('warning events expose secondsRemaining and max_duration emits analytics', async () => {
    happyPathSession()
    const { result } = renderHook(() =>
      useDictation({ analyticsLabel: ANALYTICS_LABEL }),
    )

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })

    await act(async () => {
      MockWebSocket.instances[0]?.emitMessage(
        JSON.stringify({
          type: 'warning',
          code: 'CLOSE_SOON',
          secondsRemaining: 30,
        }),
      )
    })
    expect(result.current.warningSecondsRemaining).toBe(30)

    await act(async () => {
      MockWebSocket.instances[0]?.emitMessage(
        JSON.stringify({ type: 'closed', reason: 'max_duration' }),
      )
    })
    expect(trackEventMock).toHaveBeenCalledWith(
      'DictationMaxDurationReached',
      expect.objectContaining({ label: ANALYTICS_LABEL }),
    )
  })

  it('ignores malformed server frames without crashing', async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })

    // Garbage JSON, missing type field, missing required props, and binary frames.
    await act(async () => {
      MockWebSocket.instances[0]?.emitMessage('not-json')
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ noType: true }))
      MockWebSocket.instances[0]?.emitMessage(
        JSON.stringify({ type: 'transcript', isPartial: 'yes', text: 1 }),
      )
      MockWebSocket.instances[0]?.emitMessage(new ArrayBuffer(8))
    })

    expect(result.current.status).toBe('recording')
    expect(result.current.error).toBeNull()
  })

  it('rejects untrusted absolute WebSocket URLs returned by the API', async () => {
    clientRequestMock.mockResolvedValue({
      data: {
        sessionId: 'sess-1',
        // Attacker-controlled host smuggled into wsUrl.
        wsUrl: 'wss://evil.example.com/v1/speech/transcribe/stream?ticket=t',
        maxDurationSeconds: 600,
      },
    })
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toMatch(/Untrusted WebSocket host/i)
    expect(MockWebSocket.instances).toHaveLength(0)
  })

  it('accepts absolute WebSocket URLs that match the API host', async () => {
    clientRequestMock.mockResolvedValue({
      data: {
        sessionId: 'sess-1',
        wsUrl: 'wss://api.example.test/v1/speech/transcribe/stream?ticket=t',
        maxDurationSeconds: 600,
      },
    })
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
    })

    expect(MockWebSocket.instances).toHaveLength(1)
    expect(MockWebSocket.instances[0]?.url).toBe(
      'wss://api.example.test/v1/speech/transcribe/stream?ticket=t',
    )
    expect(result.current.status).toBe('connecting')
  })

  it('stop() during getUserMedia await aborts the pipeline (race fix)', async () => {
    let resolveMic!: (stream: MockMediaStream) => void
    const micPromise = new Promise<MockMediaStream>((resolve) => {
      resolveMic = resolve
    })
    setupNavigator(() => micPromise)
    happyPathSession()

    const { result } = renderHook(() => useDictation())

    let startPromise: Promise<void>
    act(() => {
      startPromise = result.current.start()
    })
    expect(result.current.status).toBe('requesting_mic')

    await act(async () => {
      await result.current.stop()
    })
    expect(result.current.status).toBe('idle')

    const stream = new MockMediaStream()
    await act(async () => {
      resolveMic(stream)
      await startPromise
    })

    expect(result.current.status).toBe('idle')
    expect(stream.tracks[0]?.stopped).toBeGreaterThan(0)
    expect(MockWebSocket.instances).toHaveLength(0)
  })

  it('stop() during the session API call aborts the pipeline (race fix)', async () => {
    let resolveSession!: (value: unknown) => void
    clientRequestMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSession = resolve
      }),
    )
    const { result } = renderHook(() => useDictation())

    let startPromise: Promise<void>
    await act(async () => {
      startPromise = result.current.start()
      await flush()
    })
    expect(result.current.status).toBe('connecting')

    await act(async () => {
      await result.current.stop()
    })
    expect(result.current.status).toBe('idle')

    await act(async () => {
      resolveSession({
        data: {
          sessionId: 'sess-1',
          wsUrl: '/v1/speech/transcribe/stream?ticket=t',
          maxDurationSeconds: 600,
        },
      })
      await startPromise
    })

    expect(result.current.status).toBe('idle')
    expect(MockWebSocket.instances).toHaveLength(0)
  })

  it('stop() while WebSocket is CONNECTING tears down immediately instead of getting stuck', async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
    })
    expect(MockWebSocket.instances[0]?.readyState).toBe(
      MockWebSocket.CONNECTING,
    )

    await act(async () => {
      await result.current.stop()
    })

    expect(MockWebSocket.instances[0]?.sent).toHaveLength(0)
    expect(MockWebSocket.instances[0]?.closed).toBeGreaterThanOrEqual(1)
    expect(result.current.status).toBe('idle')
  })

  it('stop() with an OPEN socket forces teardown when the server never confirms (safety timeout)', async () => {
    vi.useFakeTimers()
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await Promise.resolve()
    })
    expect(result.current.status).toBe('recording')

    await act(async () => {
      await result.current.stop()
    })
    expect(result.current.status).toBe('stopping')
    expect(MockWebSocket.instances[0]?.sent).toHaveLength(1)

    await act(async () => {
      vi.advanceTimersByTime(3001)
    })
    expect(result.current.status).toBe('idle')
  })

  it('server "error" event tears down mic, socket, and AudioContext', async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })
    const stream = MockMediaStream.instances[0]!

    await act(async () => {
      MockWebSocket.instances[0]?.emitMessage(
        JSON.stringify({
          type: 'error',
          code: 'TRANSCRIBE_FAILED',
          message: 'upstream blew up',
        }),
      )
    })

    expect(result.current.status).toBe('error')
    expect(stream.tracks[0]?.stopped).toBeGreaterThan(0)
    expect(MockWebSocket.instances[0]?.closed).toBeGreaterThanOrEqual(1)
    expect(MockAudioContext.instances[0]?.closed).toBeGreaterThanOrEqual(1)
  })

  it('socket onerror tears down mic, socket, and AudioContext', async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })
    const stream = MockMediaStream.instances[0]!

    await act(async () => {
      MockWebSocket.instances[0]?.emitError()
    })

    expect(result.current.status).toBe('error')
    expect(stream.tracks[0]?.stopped).toBeGreaterThan(0)
    expect(MockWebSocket.instances[0]?.closed).toBeGreaterThanOrEqual(1)
    expect(MockAudioContext.instances[0]?.closed).toBeGreaterThanOrEqual(1)
  })

  it('start() after an error releases the prior session before acquiring new resources', async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })
    const session1Stream = MockMediaStream.instances[0]!
    const session1Socket = MockWebSocket.instances[0]!
    const session1Context = MockAudioContext.instances[0]!

    await act(async () => {
      session1Socket.emitMessage(
        JSON.stringify({
          type: 'error',
          code: 'TRANSCRIBE_FAILED',
          message: 'oops',
        }),
      )
    })
    expect(result.current.status).toBe('error')
    expect(session1Stream.tracks[0]?.stopped).toBeGreaterThan(0)
    expect(session1Socket.closed).toBeGreaterThanOrEqual(1)
    expect(session1Context.closed).toBeGreaterThanOrEqual(1)

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[1]?.open()
      MockWebSocket.instances[1]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })

    expect(result.current.status).toBe('recording')
    expect(MockWebSocket.instances).toHaveLength(2)
    expect(MockAudioContext.instances).toHaveLength(2)
    expect(MockWebSocket.instances[1]?.closed).toBe(0)
    expect(MockAudioContext.instances[1]?.closed).toBe(0)
  })

  it("a stale socket's late onclose cannot tear down the new session", async () => {
    happyPathSession()
    const { result } = renderHook(() => useDictation())

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[0]?.open()
      MockWebSocket.instances[0]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })
    const session1Socket = MockWebSocket.instances[0]!

    await act(async () => {
      session1Socket.emitMessage(
        JSON.stringify({
          type: 'error',
          code: 'X',
          message: 'fail',
        }),
      )
    })
    expect(result.current.status).toBe('error')

    await act(async () => {
      await result.current.start()
      await MockWebSocket.instances[1]?.open()
      MockWebSocket.instances[1]?.emitMessage(JSON.stringify({ type: 'ready' }))
      await flush()
    })
    expect(result.current.status).toBe('recording')
    const session2Socket = MockWebSocket.instances[1]!
    const session2Context = MockAudioContext.instances[1]!

    await act(async () => {
      session1Socket.emitClose()
    })

    expect(result.current.status).toBe('recording')
    expect(session2Socket.closed).toBe(0)
    expect(session2Context.closed).toBe(0)
  })
})
