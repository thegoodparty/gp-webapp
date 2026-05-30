import { useEffect } from 'react'

interface RichEditorMockProps {
  initialText?: string
  onChangeCallback?: (value: string, flag?: number) => void
  onTextLengthChange?: (length: number) => void
  error?: boolean
}

/**
 * Test stand-in for `app/shared/utils/RichEditor`.
 *
 * The real editor wraps Quill, which needs browser APIs jsdom does not
 * implement, so component tests mock it with this controllable textarea.
 * Typing into it drives the same `onChangeCallback` / `onTextLengthChange`
 * callbacks the real editor fires (length is the trimmed plain-text length),
 * letting tests exercise the consumer's validation behavior. The `error` prop
 * is reflected onto `data-error` so tests can assert the red-border wiring
 * without rendering real Quill.
 *
 * Use via:
 *   vi.mock('app/shared/utils/RichEditor', async () => ({
 *     default: (await import('helpers/test-utils/RichEditorMock')).RichEditorMock,
 *   }))
 */
export const RichEditorMock = ({
  initialText = '',
  onChangeCallback,
  onTextLengthChange,
  error = false,
}: RichEditorMockProps): React.JSX.Element => {
  useEffect(() => {
    if (initialText) {
      onTextLengthChange?.(initialText.trim().length)
    }
    // Mirror the real editor, which re-seeds its length whenever `initialText`
    // changes by value (e.g. after an async data fetch resolves).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialText])

  return (
    <textarea
      data-testid="rich-editor"
      data-error={error}
      defaultValue={initialText}
      onChange={(e) => {
        const value = e.target.value
        onChangeCallback?.(value)
        onTextLengthChange?.(value.trim().length)
      }}
    />
  )
}
