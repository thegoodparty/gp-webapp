'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { clientRequest } from 'gpApi/typed-request'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import type {
  SynthesizeSpeechRequest,
  SynthesizeSpeechSegment,
} from './speech-types'

export type ReadAloudStatus = 'idle' | 'loading' | 'playing' | 'error'

export type ReadAloudInput = {
  target: SynthesizeSpeechRequest['target']
  voiceId?: string
  engine?: SynthesizeSpeechRequest['options'] extends infer T
    ? T extends { engine?: infer E }
      ? E
      : never
    : never
}

export type UseReadAloudResult = {
  status: ReadAloudStatus
  error: string | null
  play: () => Promise<void>
  stop: () => void
}

export const useReadAloud = (input: ReadAloudInput): UseReadAloudResult => {
  const [status, setStatus] = useState<ReadAloudStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const segmentsRef = useRef<SynthesizeSpeechSegment[]>([])
  const indexRef = useRef(0)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null)
  // Monotonically increasing counter that identifies the most recent play/stop
  // intent. Each play() captures its own value before awaiting; a subsequent
  // stop() or play() bumps the counter, causing in-flight async work from the
  // prior call to detect the mismatch and bail out instead of racing.
  const generationRef = useRef(0)

  const cleanupAudio = useCallback(() => {
    const audio = currentAudioRef.current
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      currentAudioRef.current = null
    }
    const preload = preloadAudioRef.current
    if (preload) {
      preload.removeAttribute('src')
      preload.load()
      preloadAudioRef.current = null
    }
  }, [])

  const buildAudio = useCallback((segment: SynthesizeSpeechSegment) => {
    const audio = new Audio(segment.url)
    audio.preload = 'auto'
    return audio
  }, [])

  const playFromIndex = useCallback(
    (startIndex: number, generation: number) => {
      if (generation !== generationRef.current) {
        return
      }
      const segments = segmentsRef.current
      if (startIndex >= segments.length) {
        setStatus('idle')
        trackEvent(EVENTS.Briefings.ReadAloudCompleted, {
          targetType: input.target.type,
          targetId: input.target.id,
          segmentCount: segments.length,
        })
        cleanupAudio()
        return
      }

      indexRef.current = startIndex
      const segment = segments[startIndex]
      if (!segment) {
        return
      }
      const audio =
        preloadAudioRef.current && preloadAudioRef.current.src === segment.url
          ? preloadAudioRef.current
          : buildAudio(segment)
      preloadAudioRef.current = null
      currentAudioRef.current = audio

      const next = segments[startIndex + 1]
      if (next) {
        preloadAudioRef.current = buildAudio(next)
      }

      audio.onended = () => playFromIndex(startIndex + 1, generation)
      audio.onerror = () => {
        if (generation !== generationRef.current) {
          return
        }
        setStatus('error')
        setError('Audio playback failed')
        trackEvent(EVENTS.Briefings.ReadAloudFailed, {
          targetType: input.target.type,
          targetId: input.target.id,
          reason: 'audio_error',
        })
        cleanupAudio()
      }

      void audio.play().catch((err: Error) => {
        if (generation !== generationRef.current) {
          return
        }
        setStatus('error')
        setError(err.message || 'Playback was blocked')
        trackEvent(EVENTS.Briefings.ReadAloudFailed, {
          targetType: input.target.type,
          targetId: input.target.id,
          reason: 'play_rejected',
        })
        cleanupAudio()
      })
    },
    [buildAudio, cleanupAudio, input.target.id, input.target.type],
  )

  const play = useCallback(async () => {
    generationRef.current += 1
    const myGeneration = generationRef.current
    cleanupAudio()
    setError(null)
    setStatus('loading')
    trackEvent(EVENTS.Briefings.ReadAloudStarted, {
      targetType: input.target.type,
      targetId: input.target.id,
    })

    try {
      const response = await clientRequest('POST /v1/speech/synthesize', {
        target: input.target,
        ...(input.voiceId || input.engine
          ? {
              options: {
                ...(input.voiceId ? { voiceId: input.voiceId } : {}),
                ...(input.engine ? { engine: input.engine } : {}),
              },
            }
          : {}),
      })
      if (myGeneration !== generationRef.current) {
        return
      }
      segmentsRef.current = response.data.segments
      if (segmentsRef.current.length === 0) {
        setStatus('idle')
        return
      }
      setStatus('playing')
      playFromIndex(0, myGeneration)
    } catch (err) {
      if (myGeneration !== generationRef.current) {
        return
      }
      const message =
        err instanceof Error ? err.message : 'Failed to load audio'
      setStatus('error')
      setError(message)
      trackEvent(EVENTS.Briefings.ReadAloudFailed, {
        targetType: input.target.type,
        targetId: input.target.id,
        reason: 'synthesize_failed',
      })
    }
  }, [cleanupAudio, input.engine, input.target, input.voiceId, playFromIndex])

  const stop = useCallback(() => {
    generationRef.current += 1
    if (status === 'playing' || status === 'loading') {
      trackEvent(EVENTS.Briefings.ReadAloudStopped, {
        targetType: input.target.type,
        targetId: input.target.id,
        atSegmentIndex: indexRef.current,
        totalSegments: segmentsRef.current.length,
      })
    }
    cleanupAudio()
    setStatus('idle')
  }, [cleanupAudio, input.target.id, input.target.type, status])

  useEffect(
    () => () => {
      generationRef.current += 1
      cleanupAudio()
    },
    [cleanupAudio],
  )

  return { status, error, play, stop }
}
