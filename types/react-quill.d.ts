declare module 'react-quill' {
  import React from 'react'

  export type Range = {
    index: number
    length: number
  }

  export type Sources = 'api' | 'user' | 'silent'

  interface ReactQuillProps {
    theme?: string
    value?: string
    onChange?: (value: string) => void
    onBlur?: (
      previousRange: Range | null,
      source: Sources,
      editor: { getHTML: () => string },
    ) => void
  }

  const ReactQuill: React.ComponentType<ReactQuillProps>
  export default ReactQuill
}
