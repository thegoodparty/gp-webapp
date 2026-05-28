'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { clientRequest } from 'gpApi/typed-request'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import type {
  SpeechSynthesisEngine,
  SynthesizeSpeechSegment,
} from './speech-types'

export type ReadAloudStatus = 'idle' | 'loading' | 'playing' | 'error'

/**
 * Domain-agnostic input. Callers render their own text from whatever
 * domain object they're playing (briefings, notes, etc.) and pass the
 * raw string here; the speech service has no knowledge of the source.
 *
 * `analyticsLabel` is forwarded to analytics events so we can still slice
 * usage by surface in dashboards without coupling the hook to a domain.
 */
export type ReadAloudInput = {
  text: string
  voiceId?: string
  engine?: SpeechSynthesisEngine
  analyticsLabel?: string
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
        trackEvent(EVENTS.BriefingAssistant.ReadAloudCompleted, {
          label: input.analyticsLabel,
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
        trackEvent(EVENTS.BriefingAssistant.ReadAloudFailed, {
          label: input.analyticsLabel,
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
        trackEvent(EVENTS.BriefingAssistant.ReadAloudFailed, {
          label: input.analyticsLabel,
          reason: 'play_rejected',
        })
        cleanupAudio()
      })
    },
    [buildAudio, cleanupAudio, input.analyticsLabel],
  )

  const play = useCallback(async () => {
    generationRef.current += 1
    const myGeneration = generationRef.current
    cleanupAudio()
    setError(null)
    setStatus('loading')
    trackEvent(EVENTS.BriefingAssistant.ReadAloudStarted, {
      label: input.analyticsLabel,
    })

    try {
      const response = await clientRequest('POST /v1/speech/synthesize', {
        text: input.text,
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
      trackEvent(EVENTS.BriefingAssistant.ReadAloudFailed, {
        label: input.analyticsLabel,
        reason: 'synthesize_failed',
      })
    }
  }, [
    cleanupAudio,
    input.analyticsLabel,
    input.engine,
    input.text,
    input.voiceId,
    playFromIndex,
  ])

  const stop = useCallback(() => {
    generationRef.current += 1
    if (status === 'playing' || status === 'loading') {
      trackEvent(EVENTS.BriefingAssistant.ReadAloudStopped, {
        label: input.analyticsLabel,
        atSegmentIndex: indexRef.current,
        totalSegments: segmentsRef.current.length,
      })
    }
    cleanupAudio()
    setStatus('idle')
  }, [cleanupAudio, input.analyticsLabel, status])

  useEffect(
    () => () => {
      generationRef.current += 1
      cleanupAudio()
    },
    [cleanupAudio],
  )

  return { status, error, play, stop }
}
