'use client'
import React, { useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.bubble.css'
import { cn } from '@styleguide'
import { noop } from './noop'

interface RichEditorProps {
  initialText?: string
  onChangeCallback?: (value: string, flag?: number) => void
  onTextLengthChange?: (length: number) => void
  useOnChange?: boolean
  // Renders the editor with a destructive border to flag a validation error.
  error?: boolean
}

const RichEditor = ({
  initialText = '',
  onChangeCallback = noop,
  onTextLengthChange,
  error = false,
}: RichEditorProps): React.JSX.Element => {
  const { quill, quillRef } = useQuill({
    theme: 'bubble',
  })

  useEffect(() => {
    if (quill && initialText) {
      quill.clipboard.dangerouslyPasteHTML(initialText)
      onTextLengthChange?.(quill.getText().trim().length)
    }
  }, [quill, initialText])

  useEffect(() => {
    if (quill) {
      const textChangeHandler = () => {
        const value = quill.root.innerHTML
        if (value) {
          onChangeCallback(value)
        }
        onTextLengthChange?.(quill.getText().trim().length)
      }

      const blurHandler = () => {
        const value = quill.root.innerHTML
        if (value) {
          onChangeCallback(value, 1)
        }
        onTextLengthChange?.(quill.getText().trim().length)
      }

      quill.on('text-change', textChangeHandler)
      quill.on('blur', blurHandler)

      return () => {
        quill.off('text-change', textChangeHandler)
        quill.off('blur', blurHandler)
      }
    }
    return undefined
  }, [quill, onChangeCallback, onTextLengthChange])

  return (
    <div
      className={cn(
        'p-3 border rounded-lg [&>.quill>.ql-container]:text-base [&_.ql-editor]:wrap-anywhere',
        error ? 'border-destructive' : 'border-gray-200',
      )}
    >
      <div ref={quillRef} />
    </div>
  )
}

export default RichEditor
