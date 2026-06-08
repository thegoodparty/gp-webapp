'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@styleguide'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { getPinChannels } from 'app/dashboard/profile/texting-compliance/shared/pinChannels'
import { useSubmitCvPin } from 'app/dashboard/profile/texting-compliance/shared/useSubmitCvPin'
import PinForm from 'app/dashboard/profile/texting-compliance/shared/PinForm'
import type { TcrCompliance } from 'helpers/types'

interface ProUpgrade3PinEntryProps {
  tcrCompliance: TcrCompliance
}

// The `submitted` (awaiting-PIN) state of the pro-upgrade3 compliance surface.
// Renders the PIN entry in-place on the profile card rather than routing to the
// standalone /enter-pin page; the submit path is shared via useSubmitCvPin, so
// a successful submit invalidates the TCR query and this card re-renders to the
// in-review state.
export default function ProUpgrade3PinEntry({
  tcrCompliance,
}: ProUpgrade3PinEntryProps): React.JSX.Element {
  // Remount PinForm on each successful submit (bump its key) so the just-typed
  // digits are cleared. Unlike EnterPin, this card has no redirect to escape to:
  // if the post-submit refetch hasn't yet flipped the status off `submitted`,
  // the form re-enables and would otherwise keep the submitted PIN on screen.
  const [successKey, setSuccessKey] = useState(0)
  const { submit, submitting, error } = useSubmitCvPin(tcrCompliance, {
    onSuccess: () => setSuccessKey((key) => key + 1),
  })

  // Mirror EnterPin's funnel "viewed" signal so the pro-upgrade3 cohort, which
  // sees PIN entry in-place instead of on /enter-pin, still reports it.
  const viewTrackedRef = useRef(false)
  useEffect(() => {
    if (viewTrackedRef.current) return
    viewTrackedRef.current = true
    trackEvent(EVENTS.ProUpgrade.Compliance.PinEntryViewed)
  }, [])

  return (
    <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
      <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
      <p className="text-lg font-medium">Enter your PIN</p>
      <PinForm
        key={successKey}
        channels={getPinChannels(tcrCompliance)}
        onSubmit={submit}
        loading={submitting}
        error={error}
      />
    </Card>
  )
}
