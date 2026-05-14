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

const buildAbsoluteWsUrl = (relativeOrAbsolute: string): string => {
  if (
    relativeOrAbsolute.startsWith('ws://') ||
    relativeOrAbsolute.startsWith('wss://')
  ) {
    return relativeOrAbsolute
  }
  const apiBase = API_ROOT.replace(/^http/, 'ws').replace(/\/$/, '')
  return `${apiBase}${relativeOrAbsolute}`
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
    streamRef.current = stream

    updateStatus('connecting')
    let session
    try {
      session = await clientRequest('POST /v1/speech/transcribe/session', {
        target: input.target,
      })
    } catch (err) {
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

    const wsUrl = buildAbsoluteWsUrl(session.data.wsUrl)
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
    }
    socket.onclose = () => {
      teardown()
      if (!sawErrorRef.current) {
        updateStatus('idle')
      }
    }
    socket.onopen = async () => {
      try {
        const audioContext = new AudioContext({ sampleRate: 16000 })
        audioContextRef.current = audioContext
        await audioContext.audioWorklet.addModule(PCM_WORKLET_PATH)
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
    updateStatus('stopping')
    trackEvent(EVENTS.Briefings.DictationStopped, {
      targetType: input.target.type,
      targetId: input.target.id,
      transcriptChars: transcript.length,
    })
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'stop' }))
      } catch {
        // ignore
      }
    }
  }, [input.target.id, input.target.type, transcript.length, updateStatus])

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
