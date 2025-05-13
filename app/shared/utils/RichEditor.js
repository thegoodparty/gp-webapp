'use client'
import React, { useState, useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.bubble.css'

export default function RichEditor({
  initialText = '',
  onChangeCallback = () => {},
}) {
  const [content, setContent] = useState('')
  const { quill, quillRef } = useQuill({
    theme: 'bubble',
  })

  // Set initial content when editor is ready
  useEffect(() => {
    if (quill && initialText) {
      console.log('Setting initial text:', initialText)
      quill.clipboard.dangerouslyPasteHTML(initialText)
      setContent(initialText)
    }
  }, [quill, initialText])

  useEffect(() => {
    if (quill) {
      const textChangeHandler = () => {
        const value = quill.root.innerHTML
        console.log('Text changed:', value)
        if (value) {
          setContent(value)
          onChangeCallback(value)
        }
      }

      const blurHandler = () => {
        const value = quill.root.innerHTML
        if (value) {
          setContent(value)
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
  }, [quill, onChangeCallback])

  return (
    <div className="p-3 border rounded-lg border-gray-200 [&>.quill>.ql-container]:text-base">
      <div ref={quillRef} />
    </div>
  )
}
