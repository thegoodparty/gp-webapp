'use client'

import { useState } from 'react'
import { Volume2, Square } from 'lucide-react'
import { Button } from '@styleguide'

/**
 * Phase 3 stub for Read aloud. Toggles label between "Read aloud" and
 * "Stop" so the visual matches the spec. No actual TTS yet; wire this
 * to Nikao's speech service when it lands.
 */
export default function ReadAloudButton(): React.JSX.Element {
  const [playing, setPlaying] = useState(false)
  return (
    <Button
      variant="outline"
      aria-label={playing ? 'Stop reading' : 'Read aloud'}
      onClick={() => {
        // TODO: replace with Nikao's TTS service call.
        setPlaying((p) => !p)
      }}
    >
      {playing ? (
        <>
          <Square className="size-4" aria-hidden />
          Stop
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
