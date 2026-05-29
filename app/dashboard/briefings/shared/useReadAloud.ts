'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { clientRequest } from 'gpApi/typed-request'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import type {
  SpeechSynthesisEngine,
  SynthesizeSpeechRequest,
  SynthesizeSpeechResponse,
  SynthesizeSpeechSegment,
} from './speech-types'

export type ReadAloudStatus = 'idle' | 'loading' | 'playing' | 'error'

// Presigned segment URLs are short-lived, so a cached synthesis result is only
// safe to replay until shortly before its URLs expire. We shave a buffer off
// the soonest-expiring segment to avoid handing playback a URL that 404s.
const SYNTHESIS_CACHE_SAFETY_MS = 30_000

// Coordinates synthesize requests across every hook instance on the page. The
// briefing detail header renders two ReadAloudButtons (responsive mobile +
// desktop) with identical text, and the play path can fire while a mount-time
// prefetch is still in flight; without coordination each of those would be a
// separate POST that debits the per-user synthesize rate limit. Keyed on the
// full request body (text + voice + engine) so different voices never collide.
const inFlightSynthesis = new Map<string, Promise<SynthesizeSpeechResponse>>()
const synthesisResultCache = new Map<
  string,
  { response: SynthesizeSpeechResponse; expiresAt: number }
>()

const synthesisCacheKey = (body: SynthesizeSpeechRequest): string =>
  JSON.stringify(body)

const getFreshCachedSynthesis = (
  key: string,
): SynthesizeSpeechResponse | undefined => {
  const cached = synthesisResultCache.get(key)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.response
  }
  return undefined
}

const cacheSynthesisResult = (
  key: string,
  response: SynthesizeSpeechResponse,
): void => {
  const minExpiresInSeconds = response.segments.reduce(
    (min, segment) => Math.min(min, segment.expiresInSeconds),
    Number.POSITIVE_INFINITY,
  )
  if (!Number.isFinite(minExpiresInSeconds)) {
    return
  }
  const ttlMs = minExpiresInSeconds * 1000 - SYNTHESIS_CACHE_SAFETY_MS
  if (ttlMs > 0) {
    synthesisResultCache.set(key, {
      response,
      expiresAt: Date.now() + ttlMs,
    })
  }
}

/**
 * Warm the cache for a request body, de-duplicating concurrent and repeat
 * calls. Returns a fresh cached result, an already in-flight request, or
 * starts a new one. Used by both the mount-time prefetch and (for reuse) the
 * play path.
 */
const requestSynthesis = (
  body: SynthesizeSpeechRequest,
): Promise<SynthesizeSpeechResponse> => {
  const key = synthesisCacheKey(body)

  const cached = getFreshCachedSynthesis(key)
  if (cached) {
    return Promise.resolve(cached)
  }

  const existing = inFlightSynthesis.get(key)
  if (existing) {
    return existing
  }

  const request = clientRequest('POST /v1/speech/synthesize', body)
    .then((response) => {
      cacheSynthesisResult(key, response.data)
      return response.data
    })
    .finally(() => {
      inFlightSynthesis.delete(key)
    })

  inFlightSynthesis.set(key, request)
  return request
}

/** Clears module-level synthesis coordination state. Test-only. */
export const resetSpeechSynthesisCacheForTests = (): void => {
  inFlightSynthesis.clear()
  synthesisResultCache.clear()
}

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
  /**
   * Best-effort cache warm. Synthesizes the same text/voice/engine the play
   * path will request so the server-side S3 cache is hot by the time the user
   * clicks. Fire-and-forget: never changes playback state and swallows errors.
   */
  prefetch: () => Promise<void>
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

  const buildRequestBody = useCallback(
    (): SynthesizeSpeechRequest => ({
      text: input.text,
      ...(input.voiceId || input.engine
        ? {
            options: {
              ...(input.voiceId ? { voiceId: input.voiceId } : {}),
              ...(input.engine ? { engine: input.engine } : {}),
            },
          }
        : {}),
    }),
    [input.text, input.voiceId, input.engine],
  )

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
      const body = buildRequestBody()
      const key = synthesisCacheKey(body)
      // Reuse a result a prefetch already fetched (or one still in flight) so a
      // click that lands after — or during — the mount-time prefetch plays
      // without a second round-trip or a second hit on the synthesize rate
      // limit. Falls back to its own request when nothing is warm, which keeps
      // each play() independent (and the rapid play/stop race handling intact).
      const cached = getFreshCachedSynthesis(key)
      const inFlight = inFlightSynthesis.get(key)
      const data = cached
        ? cached
        : inFlight
        ? await inFlight
        : await (async () => {
            const response = await clientRequest(
              'POST /v1/speech/synthesize',
              body,
            )
            cacheSynthesisResult(key, response.data)
            return response.data
          })()
      if (myGeneration !== generationRef.current) {
        return
      }
      segmentsRef.current = data.segments
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
  }, [buildRequestBody, cleanupAudio, input.analyticsLabel, playFromIndex])

  const prefetch = useCallback(async () => {
    try {
      // De-dup, caching, and "already warmed" handling all live in
      // requestSynthesis, so this stays a thin fire-and-forget call. Errors
      // are swallowed: prefetch is a pure optimization, and play() will make
      // its own request and surface any real error to the user.
      await requestSynthesis(buildRequestBody())
    } catch {
      // Intentionally ignored — see above.
    }
  }, [buildRequestBody])

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

  return { status, error, play, stop, prefetch }
}
