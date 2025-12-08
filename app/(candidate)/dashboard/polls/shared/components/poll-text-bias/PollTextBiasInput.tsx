'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Button } from 'goodparty-styleguide'
import { MdAutoAwesome, MdRotateRight } from 'react-icons/md'
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
  const hasBias = biasAnalysis ? biasAnalysis.bias_spans.length > 0 : false
  const hasGrammar = biasAnalysis
    ? biasAnalysis.grammar_spans.length > 0
    : false
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
  const optimizeTextRef = React.useRef(optimizeText)
  const streamTextRef = React.useRef(streamText)
  const onChangeRef = React.useRef(onChange)
  const clearAnalysisRef = React.useRef(clearAnalysis)
  const shouldOptimizeAfterAnalysisRef = React.useRef(false)

  useEffect(() => {
    optimizeTextRef.current = optimizeText
    streamTextRef.current = streamText
    onChangeRef.current = onChange
    clearAnalysisRef.current = clearAnalysis
  }, [optimizeText, streamText, onChange, clearAnalysis])

  useEffect(() => {
    if (isAnalyzing && isWaitingToOptimize) {
      return
    }

    if (!isAnalyzing && isWaitingToOptimize && biasAnalysis) {
      setIsWaitingToOptimize(false)
      shouldOptimizeAfterAnalysisRef.current = false
      const performOptimize = async () => {
        const rewrittenText = await optimizeTextRef.current(value, true)
        if (!rewrittenText) return

        streamTextRef.current(rewrittenText, (finalText) => {
          onChangeRef.current(finalText)
          setLastOptimizedText(finalText)
          clearAnalysisRef.current()
          setIsCheckingForBias(false)
          setIsWaitingToOptimize(false)
        })
      }
      performOptimize()
    }
  }, [isAnalyzing, isWaitingToOptimize, biasAnalysis, value])

  useEffect(() => {
    if (
      !isAnalyzing &&
      isCheckingForBias &&
      biasAnalysis &&
      !isWaitingToOptimize
    ) {
      setIsCheckingForBias(false)
    }
  }, [isAnalyzing, isCheckingForBias, biasAnalysis, isWaitingToOptimize])

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

  const displayValue =
    (isOptimizing && !isStreaming) || (isWaitingToOptimize && isAnalyzing)
      ? ''
      : isStreaming
      ? streamingText
      : value

  const shouldShowHighlights =
    !!biasAnalysis && hasIssues && !isProcessing && !isWaitingToOptimize

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    if (
      trimmedValue.length > 0 &&
      meetsLengthThreshold &&
      !matchesLastOptimized &&
      !biasAnalysis
    ) {
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
  ])

  const handleContentChange = useCallback(() => {
    if (trimmedValue.length === 0) {
      clearAnalysis()
      setLastOptimizedText(null)
      setIsCheckingForBias(false)
      setIsWaitingToOptimize(false)
      shouldOptimizeAfterAnalysisRef.current = false
      if (onBiasAnalysisChange) {
        onBiasAnalysisChange({
          hasBias: false,
          hasGrammar: false,
          hasServerError: false,
          hasBeenChecked: false,
        })
      }
      return
    }

    if (textChangedFromOptimized) {
      setLastOptimizedText(null)
      clearAnalysis()
      setIsCheckingForBias(false)
      setIsWaitingToOptimize(false)
      shouldOptimizeAfterAnalysisRef.current = false
      if (onBiasAnalysisChange) {
        onBiasAnalysisChange({
          hasBias: false,
          hasGrammar: false,
          hasServerError: false,
          hasBeenChecked: false,
        })
      }
    }
  }, [
    trimmedValue,
    clearAnalysis,
    textChangedFromOptimized,
    onBiasAnalysisChange,
  ])

  const handleOptimize = useCallback(async () => {
    if (biasAnalysis) {
      const rewrittenText = await optimizeText(value)
      if (!rewrittenText) return

      streamText(rewrittenText, (finalText) => {
        onChange(finalText)
        setLastOptimizedText(finalText)
        clearAnalysis()
        setIsCheckingForBias(false)
        setIsWaitingToOptimize(false)
        shouldOptimizeAfterAnalysisRef.current = false
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
            onFocus={handleFocus}
            onBlur={handleBlur}
            showHighlights={shouldShowHighlights}
            onContentChange={handleContentChange}
            showLoadingDots={
              (isOptimizing && !isStreaming) ||
              (isWaitingToOptimize && isAnalyzing)
            }
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
