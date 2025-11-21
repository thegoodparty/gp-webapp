'use client'
import React, { useState, useCallback } from 'react'
import { Button } from 'goodparty-styleguide'
import { MdAutoAwesome, MdRotateLeft } from 'react-icons/md'
import { usePollBiasAnalysis } from './hooks/usePollBiasAnalysis'
import { useTextStreaming } from './hooks/useTextStreaming'
import PollTextInput from './PollTextInput'

interface PollTextBiasInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  setError?: (name: string, error: { type: string; message: string }) => void
  clearErrors?: (name?: string) => void
  fieldName?: string
  analysisLengthThreshold?: number
}

export default function PollTextBiasInput({
  value,
  onChange,
  placeholder = '',
  className = '',
  setError,
  clearErrors,
  fieldName,
  analysisLengthThreshold = 20,
}: PollTextBiasInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const {
    biasAnalysis,
    isAnalyzing,
    isOptimizing,
    error,
    analyzeBias,
    optimizeText,
    clearAnalysis,
  } = usePollBiasAnalysis({
    setError,
    clearErrors,
    fieldName,
  })
  const { isStreaming, streamingText, streamText } = useTextStreaming()

  const hasIssues =
    biasAnalysis &&
    (biasAnalysis.bias_spans.length > 0 ||
      biasAnalysis.grammar_spans.length > 0)

  const isProcessing = isAnalyzing || isOptimizing || isStreaming
  const canOptimize =
    value.trim().length > analysisLengthThreshold &&
    !!biasAnalysis &&
    !isProcessing

  const displayValue =
    isOptimizing && !isStreaming ? '' : isStreaming ? streamingText : value

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    analyzeBias(value)
  }, [analyzeBias, value])

  const handleContentChange = useCallback(() => {
    if (hasIssues) {
      clearAnalysis()
    }
  }, [hasIssues, clearAnalysis])

  const handleOptimize = useCallback(async () => {
    const optimizedText = await optimizeText(value)
    if (!optimizedText) return

    streamText(optimizedText, (finalText) => {
      onChange(finalText)
      clearAnalysis()
    })
  }, [optimizeText, value, onChange, clearAnalysis, streamText])

  return (
    <div className={className}>
      <div className="relative">
        <div className="relative">
          <PollTextInput
            value={displayValue}
            onChange={isProcessing ? () => {} : onChange}
            placeholder={placeholder}
            biasSpans={biasAnalysis?.bias_spans || []}
            grammarSpans={biasAnalysis?.grammar_spans || []}
            isFocused={isFocused && !isProcessing}
            onFocus={handleFocus}
            onBlur={handleBlur}
            showHighlights={!!hasIssues && !isProcessing}
            onContentChange={handleContentChange}
            showLoadingDots={isOptimizing && !isStreaming}
            isReadOnly={isProcessing}
            hidePlaceholder={isProcessing}
          />
          <div className="absolute bottom-3 right-3 z-10">
            <Button
              variant="secondary"
              className={`border-0 shadow-sm disabled:text-gray-500 disabled:bg-gray-100 font-normal ${
                hasIssues
                  ? 'text-red-500 bg-red-50 hover:!bg-red-100 active:!bg-red-50'
                  : 'text-blue-500 bg-blue-50 hover:!bg-blue-100 active:!bg-blue-50'
              }`}
              size="small"
              onClick={handleOptimize}
              disabled={!canOptimize}
            >
              {isOptimizing ? (
                <>
                  <MdRotateLeft className="size-4" />
                  <span>Working...</span>
                </>
              ) : (
                <>
                  <MdAutoAwesome className="size-4" />
                  <span>Optimize message</span>
                </>
              )}
            </Button>
          </div>
        </div>
        {error && (
          <div className="mt-1">
            <p className="text-sm font-normal text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
