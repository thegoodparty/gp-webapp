'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FetchError } from 'ofetch'
import { clientRequest } from 'gpApi/typed-request'
import { useUser } from '@shared/hooks/useUser'
import { useSnackbar } from 'helpers/useSnackbar'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { TCR_COMPLIANCE_QUERY_KEY } from 'app/dashboard/profile/texting-compliance/util/tcrCompliance.util'
import type { TcrCompliance } from 'helpers/types'

// A 4xx means the PIN itself was wrong (client-correctable); anything else is
// an upstream/Peerly failure we don't attribute to the candidate's input.
const isPinMismatch = (e: unknown): boolean =>
  e instanceof FetchError && (e.status === 400 || e.status === 422)

interface UseSubmitCvPinOptions {
  // Runs after a successful submit (analytics + snackbar + cache invalidation
  // have already fired). EnterPin uses it to redirect; the in-place profile
  // card leaves it unset and lets the invalidated query re-render the surface.
  onSuccess?: () => void
}

interface UseSubmitCvPinResult {
  submit: (pin: string) => Promise<void>
  submitting: boolean
  error: string | null
}

// Shared CampaignVerify PIN submission for both the standalone /enter-pin page
// and the pro-upgrade3 in-place compliance card, so the endpoint call, error
// classification, analytics, and cache invalidation can't drift between them.
export function useSubmitCvPin(
  tcrCompliance: TcrCompliance | null | undefined,
  { onSuccess }: UseSubmitCvPinOptions = {},
): UseSubmitCvPinResult {
  const queryClient = useQueryClient()
  const { successSnackbar } = useSnackbar()
  const [user] = useUser()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (pin: string): Promise<void> => {
    if (!tcrCompliance) return
    setSubmitting(true)
    setError(null)
    try {
      // tcrComplianceId is a path param — typed-request strips it from the
      // body before sending; only `pin` lands in the POST body.
      await clientRequest(
        'POST /v1/campaigns/tcr-compliance/:tcrComplianceId/submit-cv-pin',
        { tcrComplianceId: tcrCompliance.id, pin },
      )

      trackEvent(EVENTS.Outreach.DlcCompliance.PinVerificationCompleted, {
        email: user?.email,
        dlcComplianceStatus: 'Yes',
      })

      successSnackbar('PIN submitted — your application is in review.')
      await queryClient.invalidateQueries({
        queryKey: TCR_COMPLIANCE_QUERY_KEY,
      })
      // Clear the loading state on success too. EnterPin navigates away via
      // onSuccess so it never relied on this, but the in-place card stays
      // mounted: if the refetch hasn't yet flipped the status off `submitted`,
      // leaving `submitting` true would freeze PinForm with no way to retry.
      setSubmitting(false)
      onSuccess?.()
    } catch (e) {
      setError(
        isPinMismatch(e)
          ? 'That PIN didn’t match. Double-check and try again.'
          : 'We couldn’t verify that PIN. Please try again.',
      )
      setSubmitting(false)
    }
  }

  return { submit, submitting, error }
}
