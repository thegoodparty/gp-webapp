'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FetchError } from 'ofetch'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import { clientRequest } from 'gpApi/typed-request'
import { useUser } from '@shared/hooks/useUser'
import { useSnackbar } from 'helpers/useSnackbar'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import TextingComplianceHeader from 'app/dashboard/profile/texting-compliance/shared/TextingComplianceHeader'
import {
  TCR_COMPLIANCE_QUERY_KEY,
  TCR_COMPLIANCE_STATUS,
  getTcrCompliance,
} from 'app/dashboard/profile/texting-compliance/util/tcrCompliance.util'
import { getPinChannels } from 'app/dashboard/profile/texting-compliance/shared/pinChannels'
import PinForm from 'app/dashboard/profile/texting-compliance/shared/PinForm'

const PROFILE_ROUTE = '/dashboard/profile'

const REDIRECT_STATUSES: ReadonlyArray<string> = [
  TCR_COMPLIANCE_STATUS.PENDING,
  TCR_COMPLIANCE_STATUS.APPROVED,
]

const isPinMismatch = (e: unknown): boolean =>
  e instanceof FetchError && (e.status === 400 || e.status === 422)

export default function EnterPin(): React.JSX.Element {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { successSnackbar } = useSnackbar()
  const [user] = useUser()

  const { data: tcrCompliance, isPending } = useQuery({
    queryKey: TCR_COMPLIANCE_QUERY_KEY,
    queryFn: getTcrCompliance,
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const status = tcrCompliance?.status ?? null
  const isAwaitingPin = status === TCR_COMPLIANCE_STATUS.SUBMITTED
  const shouldRedirect = status !== null && REDIRECT_STATUSES.includes(status)

  useEffect(() => {
    if (shouldRedirect) {
      router.push(PROFILE_ROUTE)
    }
  }, [shouldRedirect, router])

  const handleSubmit = async (pin: string): Promise<void> => {
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
      router.push(PROFILE_ROUTE)
    } catch (e) {
      setError(
        isPinMismatch(e)
          ? 'That PIN didn’t match. Double-check and try again.'
          : 'We couldn’t verify that PIN. Please try again.',
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white pt-2 md:pt-0">
      <TextingComplianceHeader>
        <H5 className="flex-1 text-center md:hidden">Enter your PIN</H5>
      </TextingComplianceHeader>

      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8 mt-16 md:mt-0">
        <H2 className="mb-6 hidden md:block">Enter your PIN</H2>

        {isPending || shouldRedirect ? (
          <div className="text-sm text-gray-500">Loading…</div>
        ) : !isAwaitingPin ? (
          <OutOfStateNotice />
        ) : (
          <PinForm
            channels={getPinChannels(tcrCompliance)}
            onSubmit={handleSubmit}
            loading={submitting}
            error={error}
          />
        )}
      </div>
    </div>
  )
}

function OutOfStateNotice(): React.JSX.Element {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
      <p>
        This step isn’t available yet. Complete the previous steps from your
        profile to continue.
      </p>
      <div className="mt-3">
        <Link href={PROFILE_ROUTE} className="text-blue-600 underline">
          Back to profile
        </Link>
      </div>
    </div>
  )
}
