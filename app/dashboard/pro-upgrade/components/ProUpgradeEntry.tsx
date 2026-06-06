'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useCampaign } from '@shared/hooks/useCampaign'
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
  proUpgradeStepPath,
  type FilingStatus,
} from '../proUpgradeStep'

// Wizard index: derives the resume step from canonical state and redirects to
// it. There is no server-side wizard session (tech doc v2), so every entry
// re-derives, landing a returning candidate on the first incomplete step.
const ProUpgradeEntry = (): React.JSX.Element => {
  const router = useRouter()
  const [campaign] = useCampaign()

  const { data: website, isPending: websitePending } = useQuery({
    queryKey: USER_WEBSITE_QUERY_KEY,
    queryFn: getUserWebsite,
  })
  const { data: tcrCompliance, isPending: tcrPending } = useQuery({
    queryKey: TCR_COMPLIANCE_QUERY_KEY,
    queryFn: getTcrCompliance,
  })

  const ready = !websitePending && !tcrPending

  useEffect(() => {
    if (!ready) return

    const { filingComplete, pinComplete } =
      getTcrComplianceStatusCompletions(tcrCompliance)

    // TODO(task 07): map the candidate's persisted filing-status answer here
    // once its campaign.details key is decided. Until then it is unanswered,
    // so a candidate is held at the filing-status step rather than skipped past
    // it.
    const filingStatus: FilingStatus = 'unanswered'

    const step = deriveProUpgradeStep({
      isPro: Boolean(campaign?.isPro),
      filingStatus,
      hasEin: Boolean(campaign?.details?.einNumber),
      filingComplete,
      profileComplete: isCandidateProfileComplete(website),
      pinComplete,
    })

    router.replace(proUpgradeStepPath(step))
  }, [ready, campaign, website, tcrCompliance, router])

  return <LoadingAnimation />
}

export default ProUpgradeEntry
