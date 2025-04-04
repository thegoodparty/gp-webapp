'use client'
import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'

export default function RichEditor({
  initialText = '',
  onChangeCallback = () => {},
}) {
  const [content, setContent] = useState('')
  useEffect(() => {
    if (content !== initialText && initialText !== null) {
      setContent(initialText)
    }
  }, [initialText])

  const handleChange = (value) => {
    if (value) {
      setContent(value)
      onChangeCallback(value)
    }
  }

  const handleBlur = (previousRange, source, editor) => {
    const value = editor.getHTML()
    if (value) {
      setContent(value)
      onChangeCallback(value, 1)
    }
  }

  return (
    <div className="p-3 border rounded-lg border-gray-200 [&>.quill>.ql-container]:text-base">
      <ReactQuill
        theme="bubble"
        value={content}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  )
}
