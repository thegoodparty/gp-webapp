'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@styleguide'
import { MdAutoAwesome, MdRotateRight } from 'react-icons/md'
import { usePollBiasAnalysis } from './hooks/usePollBiasAnalysis'
import { useTextStreaming } from './hooks/useTextStreaming'
import PollTextInput from './PollTextInput'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

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
  const [isCheckingForBias, setIsCheckingForBias] = useState(false)
  const [isWaitingToOptimize, setIsWaitingToOptimize] = useState(false)
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
  const hasBias = (biasAnalysis?.bias_spans.length ?? 0) > 0
  const hasGrammar = (biasAnalysis?.grammar_spans.length ?? 0) > 0
  const hasIssues = hasBias || hasGrammar
  const matchesLastOptimized =
    lastOptimizedText !== null && trimmedValue === lastOptimizedText.trim()
  const textChangedFromOptimized =
    lastOptimizedText !== null && trimmedValue !== lastOptimizedText.trim()
  const meetsLengthThreshold = trimmedValue.length > analysisLengthThreshold
  const hasBeenChecked =
    matchesLastOptimized ||
    (!!biasAnalysis && !isAnalyzing && !isCheckingForBias)

  const biasStateRef = React.useRef<BiasAnalysisState | null>(null)
  const shouldOptimizeAfterAnalysisRef = React.useRef(false)

  const resetStates = useCallback(() => {
    setIsCheckingForBias(false)
    setIsWaitingToOptimize(false)
    shouldOptimizeAfterAnalysisRef.current = false
  }, [])

  useEffect(() => {
    if (!isAnalyzing && isWaitingToOptimize && biasAnalysis) {
      setIsWaitingToOptimize(false)
      shouldOptimizeAfterAnalysisRef.current = false
      optimizeText(value, true).then((rewrittenText) => {
        if (!rewrittenText) return
        streamText(rewrittenText, (finalText) => {
          onChange(finalText)
          setLastOptimizedText(finalText)
          setLastAnalyzedText(finalText.trim())
          clearAnalysis()
          resetStates()
        })
      })
    } else if (
      !isAnalyzing &&
      isCheckingForBias &&
      biasAnalysis &&
      !isWaitingToOptimize
    ) {
      setIsCheckingForBias(false)
      setLastAnalyzedText(trimmedValue)
    }
  }, [
    isAnalyzing,
    isWaitingToOptimize,
    isCheckingForBias,
    biasAnalysis,
    value,
    trimmedValue,
    optimizeText,
    streamText,
    onChange,
    clearAnalysis,
    resetStates,
  ])

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
  const canOptimize =
    meetsLengthThreshold && !isProcessing && !matchesLastOptimized
  const showLoadingState =
    (isOptimizing && !isStreaming) || (isWaitingToOptimize && isAnalyzing)
  const displayValue = showLoadingState
    ? ''
    : isStreaming
    ? streamingText
    : value
  const shouldShowHighlights =
    !!biasAnalysis && hasIssues && !isProcessing && !isWaitingToOptimize

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    const textChangedFromAnalyzed =
      lastAnalyzedText !== null && trimmedValue !== lastAnalyzedText
    if (
      trimmedValue.length > 0 &&
      meetsLengthThreshold &&
      !matchesLastOptimized &&
      (!biasAnalysis || textChangedFromAnalyzed)
    ) {
      if (textChangedFromAnalyzed && biasAnalysis) {
        clearAnalysis()
      }
      setIsCheckingForBias(true)
      if (shouldOptimizeAfterAnalysisRef.current) {
        setIsWaitingToOptimize(true)
        shouldOptimizeAfterAnalysisRef.current = false
      }
      analyzeBias(value)
    }
  }, [
    analyzeBias,
    value,
    trimmedValue,
    matchesLastOptimized,
    meetsLengthThreshold,
    biasAnalysis,
    lastAnalyzedText,
    clearAnalysis,
  ])

  const resetBiasState = useCallback(() => {
    onBiasAnalysisChange?.({
      hasBias: false,
      hasGrammar: false,
      hasServerError: false,
      hasBeenChecked: false,
    })
  }, [onBiasAnalysisChange])

  const handleContentChange = useCallback(
    (newValue: string) => {
      const trimmedNewValue = newValue.trim()
      if (trimmedNewValue.length === 0) {
        clearAnalysis()
        setLastOptimizedText(null)
        setLastAnalyzedText(null)
        resetStates()
        resetBiasState()
        return
      }

      const textChangedFromAnalyzed =
        lastAnalyzedText !== null && trimmedNewValue !== lastAnalyzedText

      if (textChangedFromOptimized || textChangedFromAnalyzed) {
        if (textChangedFromOptimized) {
          setLastOptimizedText(null)
        }
        if (textChangedFromAnalyzed) {
          setLastAnalyzedText(null)
        }
        clearAnalysis()
        resetStates()
        resetBiasState()
      }
    },
    [
      clearAnalysis,
      textChangedFromOptimized,
      lastAnalyzedText,
      resetStates,
      resetBiasState,
    ],
  )

  const handleOptimize = useCallback(async () => {
    trackEvent(EVENTS.createPoll.pollQuestionOptimized)
    if (biasAnalysis) {
      const rewrittenText = await optimizeText(value)
      if (!rewrittenText) return
      streamText(rewrittenText, (finalText) => {
        onChange(finalText)
        setLastOptimizedText(finalText)
        setLastAnalyzedText(finalText.trim())
        clearAnalysis()
        resetStates()
      })
    } else if (meetsLengthThreshold) {
      if (isAnalyzing || isCheckingForBias) {
        setIsWaitingToOptimize(true)
        shouldOptimizeAfterAnalysisRef.current = false
      } else {
        shouldOptimizeAfterAnalysisRef.current = true
        setIsCheckingForBias(true)
        setIsWaitingToOptimize(true)
        await analyzeBias(value)
      }
    }
  }, [
    isAnalyzing,
    isCheckingForBias,
    biasAnalysis,
    meetsLengthThreshold,
    analyzeBias,
    value,
    optimizeText,
    streamText,
    onChange,
    clearAnalysis,
    resetStates,
  ])

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
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            showHighlights={shouldShowHighlights}
            onContentChange={handleContentChange}
            showLoadingDots={showLoadingState}
            isReadOnly={isProcessing}
            hidePlaceholder={isProcessing}
          />
          <div className="absolute bottom-3 right-3 z-10">
            <Button
              variant="secondary"
              className={`border-0 shadow-sm disabled:text-gray-500 disabled:bg-gray-100 disabled:opacity-100 font-normal ${
                hasIssues
                  ? 'text-red-500 bg-red-50 hover:!bg-red-100 active:!bg-red-50'
                  : 'text-blue-500 bg-blue-50 hover:!bg-blue-100 active:!bg-blue-50'
              }`}
              size="small"
              onMouseDown={() => {
                if (
                  !biasAnalysis &&
                  meetsLengthThreshold &&
                  !isAnalyzing &&
                  !isCheckingForBias
                ) {
                  shouldOptimizeAfterAnalysisRef.current = true
                }
              }}
              onClick={handleOptimize}
              disabled={!canOptimize}
            >
              {isProcessing ? (
                <>
                  <MdRotateRight className="size-4 animate-spin" />
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
      </div>
    </div>
  )
}
