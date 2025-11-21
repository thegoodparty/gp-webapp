'use client'
import React, { useMemo } from 'react'
import { Span } from './hooks/usePollBiasAnalysis'
import LoadingDots from './LoadingDots'
import SpanTextArea from './SpanTextArea'
import { TextSpan } from './SpanTextArea.utils'

interface PollTextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  biasSpans?: Span[]
  grammarSpans?: Span[]
  isFocused: boolean
  onFocus: () => void
  onBlur: () => void
  showHighlights: boolean
  onContentChange?: () => void
  showLoadingDots?: boolean
  isReadOnly?: boolean
  hidePlaceholder?: boolean
}

export default function PollTextInput({
  value,
  onChange,
  placeholder = 'Enter your poll question...',
  biasSpans = [],
  grammarSpans = [],
  isFocused,
  onFocus,
  onBlur,
  showHighlights,
  onContentChange,
  showLoadingDots = false,
  isReadOnly = false,
  hidePlaceholder = false,
}: PollTextInputProps) {
  const hasError = biasSpans.length > 0 || grammarSpans.length > 0

  const spans: TextSpan[] = useMemo(() => {
    const allSpans: TextSpan[] = []

    biasSpans.forEach((span) => {
      allSpans.push({
        start: span.start,
        end: span.end,
        tooltipContent: (
          <div className="flex-col space-y-2">
            <p className="text-xs text-muted-foreground font-normal">
              Bias detected
            </p>
            <p className="text-xs font-normal italic">{span.reason}</p>
            <p className="text-xs font-normal">
              <b>Suggested:</b> Remove this language or use optimize message to
              rewrite message.
            </p>
          </div>
        ),
        underlineClassName:
          'underline decoration-1.5 decoration-dashed cursor-help decoration-error text-error',
      })
    })

    grammarSpans.forEach((span) => {
      allSpans.push({
        start: span.start,
        end: span.end,
        tooltipContent: (
          <div className="flex-col space-y-2">
            <p className="text-xs text-muted-foreground font-normal">
              Grammar issue
            </p>
            <p className="text-xs font-normal italic">{span.reason}</p>
            {span.suggestion && (
              <p className="text-xs font-normal">
                <b>Suggested:</b> {span.suggestion}
              </p>
            )}
          </div>
        ),
        underlineClassName:
          'underline decoration-1.5 decoration-dashed cursor-help decoration-error text-error',
      })
    })

    return allSpans
  }, [biasSpans, grammarSpans])

  return (
    <SpanTextArea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      spans={spans}
      isFocused={isFocused}
      onFocus={onFocus}
      onBlur={onBlur}
      showHighlights={showHighlights}
      onContentChange={onContentChange}
      showLoadingDots={showLoadingDots}
      isReadOnly={isReadOnly}
      hidePlaceholder={hidePlaceholder}
      hasError={hasError}
      loadingDots={
        showLoadingDots ? <LoadingDots dotColor="bg-blue-500" /> : undefined
      }
    />
  )
}
