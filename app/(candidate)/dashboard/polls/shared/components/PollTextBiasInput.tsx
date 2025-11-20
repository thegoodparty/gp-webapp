'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from 'goodparty-styleguide'
import { MdAutoAwesome, MdRotateLeft } from 'react-icons/md'
import { usePollBiasAnalysis } from '../hooks/usePollBiasAnalysis'
import PollTextInput from './PollTextInput'
import LoadingDots from './LoadingDots'

interface PollTextBiasInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export default function PollTextBiasInput({
  value,
  onChange,
  label = 'Poll Text',
  placeholder = 'Enter your poll question...',
  className = '',
}: PollTextBiasInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const {
    biasAnalysis,
    isAnalyzing,
    isOptimizing,
    error,
    analyzeBias,
    optimizeText,
    clearAnalysis,
  } = usePollBiasAnalysis({})

  const showHighlights =
    biasAnalysis &&
    (biasAnalysis.bias_spans.length > 0 ||
      biasAnalysis.grammar_spans.length > 0)
  const showOptimizeButton =
    value.trim().length > 0 &&
    !!biasAnalysis &&
    !isAnalyzing &&
    !isOptimizing &&
    !isStreaming

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    analyzeBias(value)
  }, [analyzeBias, value])

  const handleContentChange = useCallback(() => {
    if (showHighlights) {
      clearAnalysis()
    }
  }, [showHighlights, clearAnalysis])

  const handleOptimize = useCallback(async () => {
    const optimizedText = await optimizeText(value)
    if (!optimizedText) return

    setIsStreaming(true)
    setStreamingText('')
    let currentIndex = 0

    const streamCharacter = () => {
      if (currentIndex < optimizedText.length) {
        setStreamingText(optimizedText.substring(0, currentIndex + 1))
        currentIndex++
        streamingTimeoutRef.current = setTimeout(streamCharacter, 30)
      } else {
        setIsStreaming(false)
        onChange(optimizedText)
        setStreamingText('')
        clearAnalysis()
      }
    }

    streamCharacter()
  }, [optimizeText, value, onChange, clearAnalysis])

  useEffect(() => {
    return () => {
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={className}>
      <div className="relative">
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        </div>
        <div className="relative">
          <PollTextInput
            value={
              isOptimizing && !isStreaming
                ? ''
                : isStreaming
                ? streamingText
                : value
            }
            onChange={isStreaming || isOptimizing ? () => {} : onChange}
            placeholder={placeholder}
            biasSpans={biasAnalysis?.bias_spans || []}
            grammarSpans={biasAnalysis?.grammar_spans || []}
            isFocused={isFocused && !isStreaming && !isOptimizing}
            onFocus={handleFocus}
            onBlur={handleBlur}
            showHighlights={!!showHighlights && !isStreaming && !isOptimizing}
            onContentChange={handleContentChange}
            showLoadingDots={isOptimizing && !isStreaming}
            isReadOnly={isStreaming || isOptimizing}
            hidePlaceholder={isOptimizing || isStreaming}
            isOptimizing={isOptimizing || isStreaming}
          />
          <div className="absolute bottom-3 right-3 z-10">
            <Button
              variant="secondary"
              className={`border-0 shadow-sm disabled:text-gray-500 disabled:bg-gray-100 font-normal ${
                showHighlights
                  ? 'text-red-500 bg-red-100 hover:bg-red-100'
                  : 'text-blue-500 bg-blue-100 hover:bg-blue-100'
              }`}
              size="small"
              onClick={handleOptimize}
              disabled={isOptimizing || !showOptimizeButton || isStreaming}
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
          {isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 pointer-events-none z-20 rounded-md">
              <LoadingDots dotColor="bg-blue-500" />
            </div>
          )}
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
