'use client'
import React, { useState, useCallback } from 'react'
import { Button } from 'goodparty-styleguide'
import { MdAutoAwesome, MdRotateLeft } from 'react-icons/md'
import { usePollBiasAnalysis } from './hooks/usePollBiasAnalysis'
import { useTextStreaming } from './hooks/useTextStreaming'
import PollTextInput from './PollTextInput'

export interface BiasAnalysisState {
  hasBias: boolean
  hasGrammar: boolean
  hasServerError: boolean
  hasBeenChecked: boolean
}

interface PollTextBiasInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  analysisLengthThreshold?: number
  onBiasAnalysisChange?: (state: BiasAnalysisState) => void
}

export default function PollTextBiasInput({
  value,
  onChange,
  placeholder = '',
  className = '',
  analysisLengthThreshold = 20,
  onBiasAnalysisChange,
}: PollTextBiasInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [lastOptimizedText, setLastOptimizedText] = useState<string | null>(
    null,
  )
  const [lastAnalyzedText, setLastAnalyzedText] = useState<string | null>(null)
  const {
    biasAnalysis,
    isAnalyzing,
    isOptimizing,
    hasServerError,
    analyzeBias,
    optimizeText,
    clearAnalysis,
  } = usePollBiasAnalysis({})
  const { isStreaming, streamingText, streamText } = useTextStreaming()

  const trimmedValue = value.trim()
  const hasBias = biasAnalysis ? biasAnalysis.bias_spans.length > 0 : false
  const hasGrammar = biasAnalysis
    ? biasAnalysis.grammar_spans.length > 0
    : false
  const hasIssues = hasBias || hasGrammar
  const matchesLastAnalyzed =
    lastAnalyzedText !== null && trimmedValue === lastAnalyzedText
  const matchesLastOptimized =
    lastOptimizedText !== null && trimmedValue === lastOptimizedText.trim()
  const hasBeenChecked =
    matchesLastAnalyzed || matchesLastOptimized || !!biasAnalysis
  const textChangedFromAnalyzed =
    lastAnalyzedText !== null && trimmedValue !== lastAnalyzedText
  const textChangedFromOptimized =
    lastOptimizedText !== null && trimmedValue !== lastOptimizedText.trim()
  const textChangedFromChecked =
    textChangedFromAnalyzed || textChangedFromOptimized
  const meetsLengthThreshold = trimmedValue.length > analysisLengthThreshold

  const biasStateRef = React.useRef<BiasAnalysisState | null>(null)

  React.useEffect(() => {
    const currentState: BiasAnalysisState = {
      hasBias,
      hasGrammar,
      hasServerError,
      hasBeenChecked,
    }
    const prevState = biasStateRef.current
    if (
      !prevState ||
      prevState.hasBias !== currentState.hasBias ||
      prevState.hasGrammar !== currentState.hasGrammar ||
      prevState.hasServerError !== currentState.hasServerError ||
      prevState.hasBeenChecked !== currentState.hasBeenChecked
    ) {
      biasStateRef.current = currentState
      onBiasAnalysisChange?.(currentState)
    }
  }, [
    hasBias,
    hasGrammar,
    hasServerError,
    hasBeenChecked,
    onBiasAnalysisChange,
  ])

  const isProcessing = isAnalyzing || isOptimizing || isStreaming
  const canAnalyze =
    !biasAnalysis &&
    meetsLengthThreshold &&
    !isProcessing &&
    !matchesLastOptimized &&
    (lastAnalyzedText === null || textChangedFromAnalyzed)
  const canOptimize =
    !!biasAnalysis &&
    hasIssues &&
    meetsLengthThreshold &&
    !isProcessing &&
    !matchesLastOptimized

  const displayValue =
    isOptimizing && !isStreaming ? '' : isStreaming ? streamingText : value

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    if (
      trimmedValue.length > 0 &&
      !matchesLastAnalyzed &&
      !matchesLastOptimized
    ) {
      analyzeBias(value).then(() => {
        setLastAnalyzedText(trimmedValue)
      })
    }
  }, [
    analyzeBias,
    value,
    trimmedValue,
    matchesLastAnalyzed,
    matchesLastOptimized,
  ])

  const handleContentChange = useCallback(() => {
    if (hasIssues) {
      clearAnalysis()
    }
    if (textChangedFromOptimized) {
      setLastOptimizedText(null)
    }
    if (textChangedFromAnalyzed) {
      setLastAnalyzedText(null)
    }
    if (textChangedFromChecked && onBiasAnalysisChange) {
      onBiasAnalysisChange({
        hasBias: false,
        hasGrammar: false,
        hasServerError: false,
        hasBeenChecked: false,
      })
    }
  }, [
    hasIssues,
    clearAnalysis,
    textChangedFromOptimized,
    textChangedFromAnalyzed,
    textChangedFromChecked,
    onBiasAnalysisChange,
  ])

  const handleAnalyze = useCallback(async () => {
    await analyzeBias(value)
    setLastAnalyzedText(trimmedValue)
  }, [analyzeBias, value, trimmedValue])

  const handleOptimize = useCallback(async () => {
    const rewrittenText = await optimizeText(value)
    if (!rewrittenText) return

    streamText(rewrittenText, (finalText) => {
      onChange(finalText)
      setLastOptimizedText(finalText)
      setLastAnalyzedText(finalText.trim())
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
              onClick={biasAnalysis ? handleOptimize : handleAnalyze}
              disabled={!canOptimize && !canAnalyze}
            >
              {isOptimizing ? (
                <>
                  <MdRotateLeft className="size-4" />
                  <span>Working...</span>
                </>
              ) : isAnalyzing ? (
                <>
                  <MdRotateLeft className="size-4" />
                  <span>Checking for bias...</span>
                </>
              ) : biasAnalysis ? (
                <>
                  <MdAutoAwesome className="size-4" />
                  <span>Optimize message</span>
                </>
              ) : (
                <>
                  <MdAutoAwesome className="size-4" />
                  <span>Analyze for bias</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
