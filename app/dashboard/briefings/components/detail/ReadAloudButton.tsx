'use client'

import { Volume2, Square, TriangleAlert } from 'lucide-react'
import { Button, IconButton } from '@styleguide'
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
  /**
   * When true, render as an icon-only round outline button. Used in card
   * headers for non-priority items where the labeled variant takes too
   * much space.
   */
  compact?: boolean
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
  compact = false,
}: Props): React.JSX.Element {
  const { status, error, play, stop } = useReadAloud({ text, analyticsLabel })

  const isBusy = status === 'loading' || status === 'playing'
  const ariaLabel =
    status === 'error' && error
      ? `Read aloud failed: ${error}. Try again.`
      : isBusy
      ? 'Stop reading'
      : 'Read aloud'

  const onClick = () => {
    if (isBusy) {
      stop()
    } else {
      void play()
    }
  }

  if (compact) {
    return (
      <IconButton
        type="button"
        variant="outline"
        size="medium"
        aria-label={ariaLabel}
        aria-busy={status === 'loading'}
        disabled={status === 'loading'}
        loading={status === 'loading'}
        onClick={onClick}
      >
        {status === 'error' ? (
          <TriangleAlert className="size-4 text-destructive" aria-hidden />
        ) : status === 'playing' ? (
          <Square className="size-4" aria-hidden />
        ) : (
          <Volume2 className="size-4" aria-hidden />
        )}
      </IconButton>
    )
  }

  return (
    <Button
      variant="outline"
      size="small"
      aria-label={ariaLabel}
      aria-busy={status === 'loading'}
      disabled={status === 'loading'}
      onClick={onClick}
    >
      {status === 'error' ? (
        <>
          <TriangleAlert className="size-4 text-destructive" aria-hidden />
          Try again
        </>
      ) : isBusy ? (
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
