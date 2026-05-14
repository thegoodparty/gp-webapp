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
  const cancelledRef = useRef(false)

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
    (startIndex: number) => {
      const segments = segmentsRef.current
      if (cancelledRef.current || startIndex >= segments.length) {
        if (!cancelledRef.current) {
          setStatus('idle')
          trackEvent(EVENTS.Briefings.ReadAloudCompleted, {
            targetType: input.target.type,
            targetId: input.target.id,
            segmentCount: segments.length,
          })
        }
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

      audio.onended = () => playFromIndex(startIndex + 1)
      audio.onerror = () => {
        if (cancelledRef.current) {
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
        if (cancelledRef.current) {
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
    cancelledRef.current = false
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
      if (cancelledRef.current) {
        return
      }
      segmentsRef.current = response.data.segments
      if (segmentsRef.current.length === 0) {
        setStatus('idle')
        return
      }
      setStatus('playing')
      playFromIndex(0)
    } catch (err) {
      if (cancelledRef.current) {
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
  }, [input.engine, input.target, input.voiceId, playFromIndex])

  const stop = useCallback(() => {
    cancelledRef.current = true
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
      cancelledRef.current = true
      cleanupAudio()
    },
    [cleanupAudio],
  )

  return { status, error, play, stop }
}
