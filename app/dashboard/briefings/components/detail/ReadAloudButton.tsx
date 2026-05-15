'use client'

import { Volume2, Square } from 'lucide-react'
import { Button } from '@styleguide'
import { useReadAloud } from '../../shared/useReadAloud'

type Props = {
  /**
   * The plain text to read aloud. Callers render this from whatever
   * domain object they're playing (briefing, note, etc.) — the speech
   * service is a pure pipe and has no knowledge of the source domain.
   */
  text: string
  /** Optional label forwarded to analytics so usage can be sliced by surface. */
  analyticsLabel?: string
}

/**
 * Read aloud control. Plays the synthesized text via the speech service.
 * Idle / loading / playing / error states are driven by `useReadAloud`.
 * Disabled while loading; shows the underlying error from the hook to
 * anyone using a screen reader via aria-label.
 */
export default function ReadAloudButton({
  text,
  analyticsLabel,
}: Props): React.JSX.Element {
  const { status, error, play, stop } = useReadAloud({ text, analyticsLabel })

  const isBusy = status === 'loading' || status === 'playing'
  const ariaLabel =
    status === 'error' && error
      ? `Read aloud failed: ${error}. Try again.`
      : isBusy
      ? 'Stop reading'
      : 'Read aloud'

  return (
    <Button
      variant="outline"
      aria-label={ariaLabel}
      aria-busy={status === 'loading'}
      disabled={status === 'loading'}
      onClick={() => {
        if (isBusy) {
          stop()
        } else {
          void play()
        }
      }}
    >
      {isBusy ? (
        <>
          <Square className="size-4" aria-hidden />
          {status === 'loading' ? 'Loading\u2026' : 'Stop'}
        </>
      ) : (
        <>
          <Volume2 className="size-4" aria-hidden />
          Read aloud
        </>
      )}
    </Button>
  )
}
