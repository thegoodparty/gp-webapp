declare module 'react-quill' {
  import React from 'react'

  interface ReactQuillProps {
    theme?: string
    value?: string
    onChange?: (value: string) => void
    onBlur?: (previousRange: unknown, source: unknown, editor: { getHTML: () => string }) => void
  }

  const ReactQuill: React.ComponentType<ReactQuillProps>
  export default ReactQuill
}

