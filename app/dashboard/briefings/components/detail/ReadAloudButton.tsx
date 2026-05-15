'use client'

import { Volume2, Square } from 'lucide-react'
import { Button } from '@styleguide'
import { useReadAloud } from '../../shared/useReadAloud'

type Props = {
  /**
   * The meeting date in YYYY-MM-DD form. Used as the speech synthesis
   * target id; the backend resolves it to the current user's elected
   * office and looks up that day's MeetingBriefing artifact.
   */
  meetingDate: string
}

/**
 * Read aloud control. Plays the synthesized briefing audio via the speech
 * service. Idle / loading / playing / error states are driven by
 * `useReadAloud`. Disabled while loading; shows the underlying error from
 * the hook to anyone using a screen reader via aria-label.
 */
export default function ReadAloudButton({
  meetingDate,
}: Props): React.JSX.Element {
  const { status, error, play, stop } = useReadAloud({
    target: { type: 'MeetingBriefing', id: meetingDate },
  })

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
