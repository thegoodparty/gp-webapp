'use client'
import React, { useRef, useEffect, useCallback } from 'react'
import { renderHighlightedText, TextSpan } from './SpanTextArea.utils'

interface SpanTextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  spans?: TextSpan[]
  isFocused: boolean
  onFocus: () => void
  onBlur: () => void
  showHighlights: boolean
  onContentChange?: (newValue: string) => void
  showLoadingDots?: boolean
  isReadOnly?: boolean
  hidePlaceholder?: boolean
  hasWarning?: boolean
  loadingDots?: React.ReactNode
  minHeight?: string
  className?: string
}

export default function SpanTextArea({
  value,
  onChange,
  placeholder = '',
  spans = [],
  isFocused,
  onFocus,
  onBlur,
  showHighlights,
  onContentChange,
  showLoadingDots = false,
  isReadOnly = false,
  hidePlaceholder = false,
  hasWarning = false,
  loadingDots,
  minHeight = '150px',
  className = '',
}: SpanTextAreaProps) {
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
      onContentChange?.(newValue)
    },
    [onChange, onContentChange],
  )

  const getBorderClasses = () => {
    if (showLoadingDots) {
      return {
        border: 'border-gray-200',
        focusRing: 'focus:ring-2 focus:ring-gray-300',
      }
    }
    if (hasWarning) {
      return {
        border: 'border-warning-light',
        focusRing: 'focus:ring-2 focus:ring-warning-light',
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
    <div className={`relative ${className}`}>
      {showHighlightedView ? (
        <div
          key="highlighted-view"
          className={`text-sm font-normal w-full bg-white px-4 py-3 border rounded-lg cursor-text ${borderClasses.border}`}
          style={{ ...commonStyles, minHeight }}
          onMouseDown={(e) => {
            e.preventDefault()
            onFocus()
          }}
          onTouchStart={(e) => {
            e.preventDefault()
            onFocus()
          }}
        >
          {renderHighlightedText({ value, spans })}
        </div>
      ) : (
        <div className="relative">
          <div
            key="editable-view"
            ref={editorRef}
            contentEditable={!isReadOnly ? 'plaintext-only' : 'false'}
            onInput={handleInput}
            onBlur={onBlur}
            onFocus={onFocus}
            suppressContentEditableWarning
            className={`text-sm font-normal bg-white w-full px-4 py-3 border rounded-md focus:outline-none ${
              borderClasses.border
            } ${borderClasses.focusRing} ${
              isReadOnly ? 'cursor-default' : 'cursor-text'
            }`}
            style={{ ...commonStyles, minHeight }}
          />
          {showLoadingDots && loadingDots && (
            <div className="absolute top-5 left-5 pointer-events-none">
              {loadingDots}
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
