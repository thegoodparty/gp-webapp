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

  useEffect(() => {
    if (content !== initialText && initialText !== null) {
      setContent(initialText)
    }
  }, [initialText])

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const value = quill.root.innerHTML
        if (value) {
          setContent(value)
          onChangeCallback(value)
        }
      })

      quill.on('blur', () => {
        const value = quill.root.innerHTML
        if (value) {
          setContent(value)
          onChangeCallback(value, 1)
        }
      })
    }
  }, [quill, onChangeCallback])

  useEffect(() => {
    if (quill && content) {
      quill.root.innerHTML = content
    }
  }, [quill, content])

  return (
    <div className="p-3 border rounded-lg border-gray-200 [&>.quill>.ql-container]:text-base">
      <div ref={quillRef} />
    </div>
  )
}
