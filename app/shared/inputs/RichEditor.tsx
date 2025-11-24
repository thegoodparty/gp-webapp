'use client'
import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'

interface RichEditorProps {
  initialText?: string
  onChangeCallback?: (value: string, flag?: number) => void
}

const RichEditor = ({
  initialText = '',
  onChangeCallback = () => {},
}: RichEditorProps): React.JSX.Element => {
  const [content, setContent] = useState('')
  useEffect(() => {
    if (content !== initialText && initialText !== null) {
      setContent(initialText)
    }
  }, [initialText])

  const handleChange = (value: string) => {
    if (value) {
      setContent(value)
      onChangeCallback(value)
    }
  }

  const handleBlur = (_previousRange: unknown, _source: unknown, editor: { getHTML: () => string }) => {
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

export default RichEditor

