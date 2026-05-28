export type SpeechSynthesisEngine = 'neural' | 'standard' | 'generative'

/**
 * Speech is a domain-agnostic pure pipe. Callers render their own text
 * (e.g. via `renderBriefingForSpeech`) and pass it here; the speech
 * service has no knowledge of the source domain.
 */
export type SynthesizeSpeechRequest = {
  text: string
  options?: {
    voiceId?: string
    engine?: SpeechSynthesisEngine
  }
}

export type SynthesizeSpeechSegment = {
  index: number
  url: string
  expiresInSeconds: number
}

export type SynthesizeSpeechResponse = {
  format: 'audio/mpeg'
  segments: SynthesizeSpeechSegment[]
}

/**
 * Reserved as an empty object so future server-influencing options
 * (language hint, partial cadence) can be added without a breaking
 * shape change.
 */
export type TranscribeSessionRequest = Record<string, never>

export type TranscribeSessionResponse = {
  wsUrl: string
  expiresAt: string
}
