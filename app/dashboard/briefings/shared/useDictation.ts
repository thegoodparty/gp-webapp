'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { API_ROOT } from 'appEnv'
import { clientRequest } from 'gpApi/typed-request'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import type { TranscribeSessionRequest } from './speech-types'

export type DictationStatus =
  | 'idle'
  | 'requesting_mic'
  | 'connecting'
  | 'recording'
  | 'stopping'
  | 'error'

const BUSY_STATUSES: ReadonlySet<DictationStatus> = new Set([
  'requesting_mic',
  'connecting',
  'recording',
  'stopping',
])

export type DictationInput = {
  target: TranscribeSessionRequest['target']
  onFinalTranscript?: (text: string) => void
  onPartialTranscript?: (text: string) => void
}

export type UseDictationResult = {
  status: DictationStatus
  error: string | null
  transcript: string
  partialTranscript: string
  warningSecondsRemaining: number | null
  start: () => Promise<void>
  stop: () => Promise<void>
}

type ServerEvent =
  | { type: 'ready' }
  | { type: 'transcript'; isPartial: boolean; text: string }
  | { type: 'warning'; code: string; secondsRemaining: number }
  | { type: 'error'; code: string; message: string }
  | { type: 'closed'; reason: string }

const PCM_WORKLET_PATH = '/dictation/pcm-worklet.js'

// Safety net for stop(): when we send a graceful 'stop' to the server we rely
// on the server's 'closed' event (and the socket's onclose) to drive cleanup.
// If the network drops between the send and the response, those callbacks may
// never fire and the hook would be permanently stuck in 'stopping'.
const STOP_TIMEOUT_MS = 3000

const buildAbsoluteWsUrl = (relativeOrAbsolute: string): string => {
  const apiWsBase = API_ROOT.replace(/^http/, 'ws').replace(/\/$/, '')
  if (
    relativeOrAbsolute.startsWith('ws://') ||
    relativeOrAbsolute.startsWith('wss://')
  ) {
    // Defense in depth: if a compromised or misconfigured gp-api returns an
    // attacker-controlled URL here, the browser would otherwise stream live
    // microphone audio to it. Compare host (host:port) rather than origin so
    // the http→ws scheme difference doesn't cause a false mismatch.
    let supplied: URL
    let expected: URL
    try {
      supplied = new URL(relativeOrAbsolute)
      expected = new URL(apiWsBase)
    } catch {
      throw new Error('Invalid WebSocket URL')
    }
    if (supplied.host !== expected.host) {
      throw new Error(`Untrusted WebSocket host: ${supplied.host}`)
    }
    return relativeOrAbsolute
  }
  return `${apiWsBase}${relativeOrAbsolute}`
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseServerEvent = (raw: string): ServerEvent | null => {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (!isObject(parsed) || typeof parsed.type !== 'string') {
    return null
  }
  switch (parsed.type) {
    case 'ready':
      return { type: 'ready' }
    case 'transcript':
      if (
        typeof parsed.isPartial === 'boolean' &&
        typeof parsed.text === 'string'
      ) {
        return {
          type: 'transcript',
          isPartial: parsed.isPartial,
          text: parsed.text,
        }
      }
      return null
    case 'warning':
      if (
        typeof parsed.code === 'string' &&
        typeof parsed.secondsRemaining === 'number'
      ) {
        return {
          type: 'warning',
          code: parsed.code,
          secondsRemaining: parsed.secondsRemaining,
        }
      }
      return null
    case 'error':
      if (
        typeof parsed.code === 'string' &&
        typeof parsed.message === 'string'
      ) {
        return { type: 'error', code: parsed.code, message: parsed.message }
      }
      return null
    case 'closed':
      if (typeof parsed.reason === 'string') {
        return { type: 'closed', reason: parsed.reason }
      }
      return null
    default:
      return null
  }
}

export const useDictation = (input: DictationInput): UseDictationResult => {
  const [status, setStatus] = useState<DictationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [partialTranscript, setPartialTranscript] = useState('')
  const [warningSecondsRemaining, setWarningSecondsRemaining] = useState<
    number | null
  >(null)

  const wsRef = useRef<WebSocket | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const workletNodeRef = useRef<AudioWorkletNode | null>(null)
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const onFinalRef = useRef(input.onFinalTranscript)
  const onPartialRef = useRef(input.onPartialTranscript)
  const statusRef = useRef<DictationStatus>('idle')
  const sawErrorRef = useRef(false)
  // Monotonically increasing generation that identifies the most recent
  // start() attempt. Each start() captures its own value before awaiting; a
  // subsequent stop(), teardown, server-driven 'closed', or unmount bumps the
  // counter so any in-flight async work from the prior attempt detects the
  // mismatch and bails out instead of silently re-acquiring resources after
  // the user has cancelled.
  const generationRef = useRef(0)

  useEffect(() => {
    onFinalRef.current = input.onFinalTranscript
    onPartialRef.current = input.onPartialTranscript
  }, [input.onFinalTranscript, input.onPartialTranscript])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  const updateStatus = useCallback((next: DictationStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const teardown = useCallback(() => {
    // Any in-flight start() that survives past this point would be racing the
    // freshly-cleaned-up refs, so invalidate its generation.
    generationRef.current += 1
    if (workletNodeRef.current) {
      workletNodeRef.current.port.onmessage = null
      workletNodeRef.current.disconnect()
      workletNodeRef.current = null
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect()
      sourceNodeRef.current = null
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close().catch(() => undefined)
      audioContextRef.current = null
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop()
      }
      streamRef.current = null
    }
    if (wsRef.current) {
      const socket = wsRef.current
      wsRef.current = null
      // Detach handlers before close so any onclose/onerror that fires after
      // teardown() (e.g. because we cancelled while CONNECTING, or because a
      // new start() has already overwritten wsRef) cannot reach back into the
      // hook and clobber the new session's refs / status.
      socket.onopen = null
      socket.onmessage = null
      socket.onerror = null
      socket.onclose = null
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        try {
          socket.close()
        } catch {
          // ignore
        }
      }
    }
  }, [])

  const handleServerEvent = useCallback(
    (event: ServerEvent) => {
      switch (event.type) {
        case 'ready':
          updateStatus('recording')
          return
        case 'transcript':
          if (event.isPartial) {
            setPartialTranscript(event.text)
            onPartialRef.current?.(event.text)
            return
          }
          setTranscript((prev) =>
            prev.length === 0 ? event.text : `${prev} ${event.text}`,
          )
          setPartialTranscript('')
          onFinalRef.current?.(event.text)
          return
        case 'warning':
          setWarningSecondsRemaining(event.secondsRemaining)
          return
        case 'error':
          sawErrorRef.current = true
          setError(event.message)
          updateStatus('error')
          trackEvent(EVENTS.Briefings.DictationFailed, {
            targetType: input.target.type,
            targetId: input.target.id,
            code: event.code,
          })
          // Release mic / WebSocket / AudioContext immediately so a subsequent
          // start() doesn't overwrite the refs and orphan them.
          teardown()
          return
        case 'closed':
          if (event.reason === 'max_duration') {
            trackEvent(EVENTS.Briefings.DictationMaxDurationReached, {
              targetType: input.target.type,
              targetId: input.target.id,
            })
          }
          setWarningSecondsRemaining(null)
          if (!sawErrorRef.current) {
            updateStatus('idle')
          }
          teardown()
      }
    },
    [input.target.id, input.target.type, teardown, updateStatus],
  )

  const start = useCallback(async () => {
    if (BUSY_STATUSES.has(statusRef.current)) {
      return
    }
    // Defensive cleanup: if we're entering from 'error' (or any state where a
    // previous session's mic/socket/AudioContext is still alive), release
    // those resources before we acquire fresh ones. Otherwise we'd overwrite
    // the refs and orphan the old resources, leaking the microphone and
    // leaving a stale socket whose onclose could later teardown() this new
    // session.
    teardown()

    generationRef.current += 1
    const myGeneration = generationRef.current
    const isCancelled = (): boolean => myGeneration !== generationRef.current

    sawErrorRef.current = false
    setError(null)
    setTranscript('')
    setPartialTranscript('')
    setWarningSecondsRemaining(null)
    updateStatus('requesting_mic')

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
    } catch (err) {
      if (isCancelled()) {
        return
      }
      const message =
        err instanceof Error ? err.message : 'Microphone access denied'
      sawErrorRef.current = true
      setError(message)
      updateStatus('error')
      trackEvent(EVENTS.Briefings.DictationFailed, {
        targetType: input.target.type,
        targetId: input.target.id,
        code: 'MIC_DENIED',
      })
      return
    }
    if (isCancelled()) {
      // stop()/teardown ran while we were awaiting the mic. Make sure the
      // freshly-acquired stream's tracks don't keep the mic open.
      for (const track of stream.getTracks()) {
        track.stop()
      }
      return
    }
    streamRef.current = stream

    updateStatus('connecting')
    let session
    try {
      session = await clientRequest('POST /v1/speech/transcribe/session', {
        target: input.target,
      })
    } catch (err) {
      if (isCancelled()) {
        return
      }
      const message =
        err instanceof Error ? err.message : 'Failed to open dictation session'
      sawErrorRef.current = true
      setError(message)
      updateStatus('error')
      trackEvent(EVENTS.Briefings.DictationFailed, {
        targetType: input.target.type,
        targetId: input.target.id,
        code: 'SESSION_FAILED',
      })
      teardown()
      return
    }
    if (isCancelled()) {
      return
    }

    let wsUrl: string
    try {
      wsUrl = buildAbsoluteWsUrl(session.data.wsUrl)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Invalid WebSocket URL'
      sawErrorRef.current = true
      setError(message)
      updateStatus('error')
      teardown()
      return
    }
    let socket: WebSocket
    try {
      socket = new WebSocket(wsUrl)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to open WebSocket'
      sawErrorRef.current = true
      setError(message)
      updateStatus('error')
      teardown()
      return
    }
    socket.binaryType = 'arraybuffer'
    wsRef.current = socket

    socket.onmessage = (msg) => {
      if (typeof msg.data !== 'string') {
        return
      }
      const event = parseServerEvent(msg.data)
      if (event) {
        handleServerEvent(event)
      }
    }
    socket.onerror = () => {
      sawErrorRef.current = true
      setError('WebSocket error')
      updateStatus('error')
      trackEvent(EVENTS.Briefings.DictationFailed, {
        targetType: input.target.type,
        targetId: input.target.id,
        code: 'WS_ERROR',
      })
      teardown()
    }
    socket.onclose = () => {
      teardown()
      if (!sawErrorRef.current) {
        updateStatus('idle')
      }
    }
    socket.onopen = async () => {
      const audioContext = new AudioContext({ sampleRate: 16000 })
      audioContextRef.current = audioContext
      try {
        await audioContext.audioWorklet.addModule(PCM_WORKLET_PATH)
        if (isCancelled()) {
          // stop()/teardown ran while addModule was awaiting. Close the
          // orphaned context and detach the ref so a later teardown doesn't
          // operate on it.
          if (audioContextRef.current === audioContext) {
            audioContextRef.current = null
          }
          void audioContext.close().catch(() => undefined)
          return
        }
        const sourceNode = audioContext.createMediaStreamSource(stream)
        sourceNodeRef.current = sourceNode
        const workletNode = new AudioWorkletNode(
          audioContext,
          'pcm-encoder-processor',
          {
            processorOptions: { targetSampleRate: 16000, frameSize: 2048 },
          },
        )
        workletNodeRef.current = workletNode
        workletNode.port.onmessage = (event) => {
          if (!(event.data instanceof ArrayBuffer)) {
            return
          }
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(event.data)
          }
        }
        sourceNode.connect(workletNode)
        workletNode.connect(audioContext.destination)
        trackEvent(EVENTS.Briefings.DictationStarted, {
          targetType: input.target.type,
          targetId: input.target.id,
        })
      } catch (err) {
        if (isCancelled()) {
          if (audioContextRef.current === audioContext) {
            audioContextRef.current = null
          }
          void audioContext.close().catch(() => undefined)
          return
        }
        const message =
          err instanceof Error ? err.message : 'Failed to start audio pipeline'
        sawErrorRef.current = true
        setError(message)
        updateStatus('error')
        trackEvent(EVENTS.Briefings.DictationFailed, {
          targetType: input.target.type,
          targetId: input.target.id,
          code: 'AUDIO_PIPELINE_FAILED',
        })
        teardown()
      }
    }
  }, [handleServerEvent, input.target, teardown, updateStatus])

  const stop = useCallback(async () => {
    const current = statusRef.current
    if (current === 'idle' || current === 'error' || current === 'stopping') {
      return
    }
    // Invalidate any in-flight start() before changing observable state so its
    // post-await cancellation checks fire.
    generationRef.current += 1
    updateStatus('stopping')
    trackEvent(EVENTS.Briefings.DictationStopped, {
      targetType: input.target.type,
      targetId: input.target.id,
      transcriptChars: transcript.length,
    })

    const socket = wsRef.current
    if (socket?.readyState !== WebSocket.OPEN) {
      // Socket is still CONNECTING or already CLOSING/CLOSED — no graceful
      // server confirmation will arrive, so tear down directly.
      teardown()
      updateStatus('idle')
      return
    }

    try {
      socket.send(JSON.stringify({ type: 'stop' }))
    } catch {
      teardown()
      updateStatus('idle')
      return
    }

    setTimeout(() => {
      if (statusRef.current === 'stopping') {
        teardown()
        updateStatus('idle')
      }
    }, STOP_TIMEOUT_MS)
  }, [
    input.target.id,
    input.target.type,
    teardown,
    transcript.length,
    updateStatus,
  ])

  useEffect(
    () => () => {
      teardown()
    },
    [teardown],
  )

  return {
    status,
    error,
    transcript,
    partialTranscript,
    warningSecondsRemaining,
    start,
    stop,
  }
}
