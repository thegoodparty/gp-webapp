'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@styleguide'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import {
  CAMPAIGN_QUERY_KEY,
  fetchCampaign,
} from '@shared/hooks/CampaignProvider'
import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import {
  USER_WEBSITE_QUERY_KEY,
  getUserWebsite,
} from 'app/dashboard/website/util/website.util'
import {
  TCR_COMPLIANCE_QUERY_KEY,
  getTcrCompliance,
  getTcrComplianceStatusCompletions,
} from 'app/dashboard/profile/texting-compliance/util/tcrCompliance.util'
import { isCandidateProfileComplete } from 'app/dashboard/profile/texting-compliance/candidate-profile/candidateProfile.utils'
import {
  deriveProUpgradeStep,
  filingStatusFromDetails,
  proUpgradeStepPath,
} from '../proUpgradeStep'

// Wizard index: derives the resume step from canonical state and redirects to
// it. There is no server-side wizard session (tech doc v2), so every entry
// re-derives, landing a returning candidate on the first incomplete step.
const ProUpgradeEntry = (): React.JSX.Element | null => {
  const router = useRouter()

  // Observe the shared campaign query (same key as CampaignProvider, deduped)
  // so step derivation waits for it. Reading campaign from context instead
  // would let `ready` flip true while the campaign is still loading (when the
  // SSR fetch returned null on token/API failure, so initialData is undefined),
  // mis-deriving a returning candidate and producing a double-redirect.
  const {
    data: campaign,
    isPending: campaignPending,
    isError: campaignError,
    refetch: refetchCampaign,
  } = useQuery({
    queryKey: CAMPAIGN_QUERY_KEY,
    queryFn: fetchCampaign,
  })
  const {
    data: website,
    isPending: websitePending,
    isError: websiteError,
    refetch: refetchWebsite,
  } = useQuery({
    queryKey: USER_WEBSITE_QUERY_KEY,
    queryFn: getUserWebsite,
  })
  const {
    data: tcrCompliance,
    isPending: tcrPending,
    isError: tcrError,
    refetch: refetchTcr,
  } = useQuery({
    queryKey: TCR_COMPLIANCE_QUERY_KEY,
    queryFn: getTcrCompliance,
  })

  const ready = !campaignPending && !websitePending && !tcrPending
  const hasError = campaignError || websiteError || tcrError

  useEffect(() => {
    // Don't derive a step from partial state: a failed fetch leaves data
    // undefined, which would mis-derive a returning candidate back to the
    // value-prop intro as if they had zero progress.
    if (!ready || hasError) return

    const { filingComplete, pinComplete } =
      getTcrComplianceStatusCompletions(tcrCompliance)

    const step = deriveProUpgradeStep({
      isPro: Boolean(campaign?.isPro),
      filingStatus: filingStatusFromDetails(campaign?.details?.hasFiledForRace),
      hasEin: Boolean(campaign?.details?.einNumber),
      filingComplete,
      profileComplete: isCandidateProfileComplete(website),
      pinComplete,
    })

    router.replace(proUpgradeStepPath(step))
  }, [ready, hasError, campaign, website, tcrCompliance, router])

  // Spinner only while the canonical-state queries are pending.
  if (!ready) return <LoadingAnimation />

  // A fetch failed: show a recoverable error instead of mis-routing to the
  // intro. Refetching clears the error and re-runs the redirect effect.
  if (hasError) {
    return (
      <div className="text-center">
        <H2 className="mb-2">Something went wrong</H2>
        <Body2 className="mb-6 text-gray-600">
          We couldn&apos;t load your upgrade details. Please try again.
        </Body2>
        <Button
          onClick={() => {
            void refetchCampaign()
            void refetchWebsite()
            void refetchTcr()
          }}
        >
          Try again
        </Button>
      </div>
    )
  }

  // Ready, no error: the redirect is already scheduled in the effect above, so
  // return null — a silently-failed router.replace can't strand the user on a
  // permanent spinner.
  return null
}

export default ProUpgradeEntry
