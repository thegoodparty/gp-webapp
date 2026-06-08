'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import TextingComplianceHeader from 'app/dashboard/profile/texting-compliance/shared/TextingComplianceHeader'
import {
  TCR_COMPLIANCE_QUERY_KEY,
  TCR_COMPLIANCE_STATUS,
  getTcrCompliance,
} from 'app/dashboard/profile/texting-compliance/util/tcrCompliance.util'
import { getPinChannels } from 'app/dashboard/profile/texting-compliance/shared/pinChannels'
import { useSubmitCvPin } from 'app/dashboard/profile/texting-compliance/shared/useSubmitCvPin'
import PinForm from 'app/dashboard/profile/texting-compliance/shared/PinForm'

const PROFILE_ROUTE = '/dashboard/profile'

const REDIRECT_STATUSES: ReadonlyArray<string> = [
  TCR_COMPLIANCE_STATUS.PENDING,
  TCR_COMPLIANCE_STATUS.APPROVED,
]

export default function EnterPin(): React.JSX.Element {
  const router = useRouter()

  const { data: tcrCompliance, isPending } = useQuery({
    queryKey: TCR_COMPLIANCE_QUERY_KEY,
    queryFn: getTcrCompliance,
  })

  const { submit, submitting, error } = useSubmitCvPin(tcrCompliance, {
    onSuccess: () => router.push(PROFILE_ROUTE),
  })

  const status = tcrCompliance?.status ?? null
  const isAwaitingPin = status === TCR_COMPLIANCE_STATUS.SUBMITTED
  const shouldRedirect = status !== null && REDIRECT_STATUSES.includes(status)

  useEffect(() => {
    if (shouldRedirect) {
      router.push(PROFILE_ROUTE)
    }
  }, [shouldRedirect, router])

  // Funnel "viewed" event for the agentic compliance flow (ENG-10294). Fire
  // only once the PIN entry UI is actually shown — this page redirects away for
  // PENDING/APPROVED, so a bare mount event would count users who never see it.
  // The matching "submitted" signal is the PinVerificationCompleted event
  // fired by useSubmitCvPin.
  const pinViewTrackedRef = useRef(false)
  useEffect(() => {
    if (isPending || !isAwaitingPin || pinViewTrackedRef.current) return
    pinViewTrackedRef.current = true
    trackEvent(EVENTS.ProUpgrade.Compliance.PinEntryViewed)
  }, [isPending, isAwaitingPin])

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
            onSubmit={submit}
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
