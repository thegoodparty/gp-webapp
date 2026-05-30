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
 * It intentionally does NOT report a length on mount from `initialText`. The
 * real editor is dynamically imported and only emits its first
 * `onTextLengthChange` once Quill has initialized, so there is a window where
 * server-provided content exists but no length has been reported. Consumers
 * that gate a Submit/Save on the length must seed it themselves from the
 * server value; this mock holds them to that.
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
