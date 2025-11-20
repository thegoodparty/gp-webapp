'use client'
import React, { useRef, useEffect, useCallback } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { Span } from '../hooks/usePollBiasAnalysis'
import LoadingDots from './LoadingDots'

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
  isOptimizing?: boolean
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
  isOptimizing = false,
}: PollTextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) return

    if (!isFocused && showHighlights) {
      editorRef.current.textContent = ''
      return
    }

    if (isFocused) {
      const textContent = editorRef.current.textContent || ''
      if (textContent !== value) {
        editorRef.current.textContent = value || ''
        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    } else {
      const textContent = editorRef.current.textContent || ''
      if (textContent !== value) {
        editorRef.current.textContent = value || ''
      }
    }
  }, [value, isFocused, showHighlights])

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const newValue = e.currentTarget.textContent || ''
      onChange(newValue)
      onContentChange?.()
    },
    [onChange, onContentChange],
  )

  const renderHighlightedText = () => {
    if (
      !showHighlights ||
      (biasSpans.length === 0 && grammarSpans.length === 0)
    ) {
      return value
    }

    const allSpans: Array<Span & { type: 'bias' | 'grammar' }> = [
      ...biasSpans.map((span) => ({ ...span, type: 'bias' as const })),
      ...grammarSpans.map((span) => ({ ...span, type: 'grammar' as const })),
    ].sort((a, b) => a.start - b.start)

    const parts: React.ReactNode[] = []
    let lastIndex = 0

    allSpans.forEach((span, index) => {
      if (span.start > lastIndex) {
        const textBefore = value.substring(lastIndex, span.start)
        if (textBefore) {
          parts.push(
            <React.Fragment key={`text-before-${index}`}>
              {textBefore}
            </React.Fragment>,
          )
        }
      }
      const spanText = value.substring(span.start, span.end)
      const isBias = span.type === 'bias'
      parts.push(
        <Tooltip
          key={`${span.type}-${index}`}
          title={
            <div className="flex-col space-y-2">
              <p className="text-xs text-muted-foreground font-normal">
                {isBias ? 'Bias detected' : 'Grammar issue'}
              </p>
              <p className="text-xs font-normal italic">{span.reason}</p>
              {(isBias || span.suggestion) && (
                <p className="text-xs font-normal">
                  <b>Suggested:</b>{' '}
                  {isBias
                    ? 'Remove this language or use optimize message to rewrite message.'
                    : span.suggestion}
                </p>
              )}
            </div>
          }
          placement="top"
          arrow={false}
          slotProps={{
            tooltip: {
              sx: {
                padding: '12px',
                bgcolor: 'white',
                color: 'black',
                border: '1px solid #ccc',
                maxWidth: '300px',
                '& .MuiTooltip-arrow': {
                  color: 'white',
                },
              },
            },
          }}
        >
          <span className="underline decoration-1.5 decoration-dashed cursor-help decoration-error text-error">
            {spanText}
          </span>
        </Tooltip>,
      )
      lastIndex = span.end
    })

    if (lastIndex < value.length) {
      const textAfter = value.substring(lastIndex)
      if (textAfter) {
        parts.push(
          <React.Fragment key="text-after">{textAfter}</React.Fragment>,
        )
      }
    }

    return <>{parts}</>
  }

  const hasIssues = biasSpans.length > 0 || grammarSpans.length > 0

  const getBorderClass = () => {
    if (isOptimizing) {
      return 'border-gray-300'
    }
    if (hasIssues) {
      return 'border-red-500'
    }
    if (isFocused) {
      return 'border-blue-200'
    }
    return 'border-gray-300'
  }

  return (
    <div className="relative">
      {!isFocused && showHighlights ? (
        <div
          key="highlighted-view"
          className={`text-sm font-normal w-full min-h-[150px] bg-white px-4 py-3 border rounded-lg cursor-text ${getBorderClass()}`}
          style={{
            overflowY: 'auto',
            maxHeight: '400px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
          onClick={onFocus}
        >
          {renderHighlightedText()}
        </div>
      ) : (
        <div className="relative">
          <div
            key="editable-view"
            ref={editorRef}
            contentEditable={!isReadOnly}
            onInput={handleInput}
            onBlur={onBlur}
            onFocus={onFocus}
            suppressContentEditableWarning
            className={`text-sm font-normal bg-white w-full min-h-[150px] px-4 py-3 border rounded-md focus:outline-none ${
              isOptimizing
                ? 'border-gray-300 focus:ring-2 focus:ring-gray-300'
                : hasIssues
                ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                : isFocused
                ? 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                : 'border-gray-300 focus:ring-2 focus:ring-primary'
            } ${isReadOnly ? 'cursor-default' : 'cursor-text'}`}
            style={{
              overflowY: 'auto',
              maxHeight: '400px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          />
          {showLoadingDots && (
            <div className="absolute top-5 left-5 pointer-events-none">
              <LoadingDots dotColor="bg-blue-500" />
            </div>
          )}
          {!value && !showLoadingDots && !hidePlaceholder && (
            <div
              className="text-sm font-normal absolute top-3 left-4 pointer-events-none text-gray-400 pr-2"
              style={{
                fontFamily: 'var(--outfit-font)',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
            >
              {placeholder}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
