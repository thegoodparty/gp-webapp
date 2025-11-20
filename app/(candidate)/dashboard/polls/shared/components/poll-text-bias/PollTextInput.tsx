'use client'
import React, { useRef, useEffect, useCallback } from 'react'
import { Span } from './hooks/usePollBiasAnalysis'
import LoadingDots from './LoadingDots'
import { renderHighlightedText } from './PollTextInput.utils'

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

    const currentText = editorRef.current.textContent || ''
    if (currentText === value) return

    editorRef.current.textContent = value || ''

    if (isFocused) {
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
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

  const hasIssues = biasSpans.length > 0 || grammarSpans.length > 0

  const getBorderClasses = () => {
    if (isOptimizing) {
      return {
        border: 'border-gray-200',
        focusRing: 'focus:ring-2 focus:ring-gray-300',
      }
    }
    if (hasIssues) {
      return {
        border: 'border-red-300',
        focusRing: 'focus:ring-2 focus:ring-red-300',
      }
    }
    if (isFocused) {
      return {
        border: 'border-blue-300',
        focusRing: 'focus:ring-2 focus:ring-blue-300',
      }
    }
    return {
      border: 'border-gray-200',
      focusRing: 'focus:ring-2 focus:ring-primary',
    }
  }

  const borderClasses = getBorderClasses()
  const commonStyles = {
    overflowY: 'auto' as const,
    maxHeight: '400px',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    overflowWrap: 'break-word' as const,
  }

  const showHighlightedView = !isFocused && showHighlights

  return (
    <div className="relative">
      {showHighlightedView ? (
        <div
          key="highlighted-view"
          className={`text-sm font-normal w-full min-h-[150px] bg-white px-4 py-3 border rounded-lg cursor-text ${borderClasses.border}`}
          style={commonStyles}
          onClick={onFocus}
        >
          {renderHighlightedText({ value, biasSpans, grammarSpans })}
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
              borderClasses.border
            } ${borderClasses.focusRing} ${
              isReadOnly ? 'cursor-default' : 'cursor-text'
            }`}
            style={commonStyles}
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
