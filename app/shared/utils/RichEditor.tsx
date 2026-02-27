'use client'
import React, { useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.bubble.css'

interface RichEditorProps {
  initialText?: string
  onChangeCallback?: (value: string, flag?: number) => void
  useOnChange?: boolean
}

const RichEditor = ({
  initialText = '',
  onChangeCallback = () => {},
}: RichEditorProps): React.JSX.Element => {
  const { quill, quillRef } = useQuill({
    theme: 'bubble',
  })

  useEffect(() => {
    if (quill && initialText) {
      quill.clipboard.dangerouslyPasteHTML(initialText)
    }
  }, [quill, initialText])

  useEffect(() => {
    if (quill) {
      const textChangeHandler = () => {
        const value = quill.root.innerHTML
        if (value) {
          onChangeCallback(value)
        }
      }

      const blurHandler = () => {
        const value = quill.root.innerHTML
        if (value) {
          onChangeCallback(value, 1)
        }
      }

      quill.on('text-change', textChangeHandler)
      quill.on('blur', blurHandler)

      return () => {
        quill.off('text-change', textChangeHandler)
        quill.off('blur', blurHandler)
      }
    }
    return undefined
  }, [quill, onChangeCallback])

  return (
    <div className="p-3 border rounded-lg border-gray-200 [&>.quill>.ql-container]:text-base">
      <div ref={quillRef} />
    </div>
  )
}

export default RichEditor
