'use client'

import { useEffect } from 'react'
import {
  Button,
  IconButton,
  SquareIcon,
  TriangleAlertIcon,
  Volume2Icon,
} from '@styleguide'
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
  const { status, error, play, stop, prefetch } = useReadAloud({
    text,
    analyticsLabel,
  })

  // Warm the server-side audio cache as soon as the control is on screen so the
  // first click plays (near-)instantly instead of waiting on Polly synthesis.
  useEffect(() => {
    void prefetch()
  }, [prefetch])

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
          <TriangleAlertIcon className="size-4 text-destructive" aria-hidden />
        ) : status === 'playing' ? (
          <SquareIcon className="size-4" aria-hidden />
        ) : (
          <Volume2Icon className="size-4" aria-hidden />
        )}
      </IconButton>
    )
  }

  return (
    <Button
      variant="outline"
      aria-label={ariaLabel}
      aria-busy={status === 'loading'}
      disabled={status === 'loading'}
      className="text-sm!"
      onClick={onClick}
    >
      {status === 'error' ? (
        <>
          <TriangleAlertIcon className="size-4 text-destructive" aria-hidden />
          Try again
        </>
      ) : isBusy ? (
        <>
          <SquareIcon className="size-4" aria-hidden />
          {status === 'loading' ? 'Loading\u2026' : 'Stop'}
        </>
      ) : (
        <>
          <Volume2Icon className="size-4" aria-hidden />
          Read aloud
        </>
      )}
    </Button>
  )
}
