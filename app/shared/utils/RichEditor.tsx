'use client'
import React, { useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.bubble.css'
import { noop } from './noop'

interface RichEditorProps {
  initialText?: string
  onChangeCallback?: (value: string, flag?: number) => void
  onTextLengthChange?: (length: number) => void
  useOnChange?: boolean
}

const RichEditor = ({
  initialText = '',
  onChangeCallback = noop,
  onTextLengthChange,
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
    <div className="p-3 border rounded-lg border-gray-200 [&>.quill>.ql-container]:text-base">
      <div ref={quillRef} />
    </div>
  )
}

export default RichEditor
