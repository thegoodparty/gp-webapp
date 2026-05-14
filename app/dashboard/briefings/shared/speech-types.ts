export type SpeechSynthesisTargetType = 'MeetingBriefing'

export type SpeechSynthesisEngine = 'neural' | 'standard'

export type SynthesizeSpeechRequest = {
  target: {
    type: SpeechSynthesisTargetType
    id: string
  }
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

export type SpeechToTextTargetType = 'note'

export type TranscribeSessionRequest = {
  target: {
    type: SpeechToTextTargetType
    id: string
  }
}

export type TranscribeSessionResponse = {
  wsUrl: string
  expiresAt: string
}
