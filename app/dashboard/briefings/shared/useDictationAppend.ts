'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useDictation, type DictationStatus } from './useDictation'

const ACTIVE_STATUSES: ReadonlySet<DictationStatus> = new Set([
  'requesting_mic',
  'connecting',
  'recording',
  'stopping',
])

const BUSY_STATUSES: ReadonlySet<DictationStatus> = new Set([
  'requesting_mic',
  'connecting',
  'stopping',
])

export type UseDictationAppendInput = {
  analyticsLabel: string
  value: string
  onChange: (next: string) => void
}

export type UseDictationAppendResult = {
  status: DictationStatus
  error: string | null
  partialTranscript: string
  active: boolean
  busy: boolean
  start: () => Promise<void>
  stop: () => Promise<void>
  toggle: () => Promise<void>
}

export const useDictationAppend = ({
  analyticsLabel,
  value,
  onChange,
}: UseDictationAppendInput): UseDictationAppendResult => {
  const valueRef = useRef(value)
  valueRef.current = value
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const dictation = useDictation({
    analyticsLabel,
    onFinalTranscript: (text) => {
      if (!text) return
      const current = valueRef.current
      const sep = current.length > 0 && !current.endsWith(' ') ? ' ' : ''
      onChangeRef.current(current + sep + text)
    },
  })

  const active = ACTIVE_STATUSES.has(dictation.status)
  const busy = BUSY_STATUSES.has(dictation.status)

  const toggle = useCallback(async (): Promise<void> => {
    if (ACTIVE_STATUSES.has(dictation.status)) {
      await dictation.stop()
      return
    }
    await dictation.start()
  }, [dictation])

  return {
    status: dictation.status,
    error: dictation.error,
    partialTranscript: dictation.partialTranscript,
    active,
    busy,
    start: dictation.start,
    stop: dictation.stop,
    toggle,
  }
}
