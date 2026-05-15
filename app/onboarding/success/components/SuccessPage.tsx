'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@styleguide'
import { useCampaign } from '@shared/hooks/useCampaign'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { useUser } from '@shared/hooks/useUser'
import type { User } from 'helpers/types'
import ConfettiCanvas from './ConfettiCanvas'
import HeroCard from './HeroCard'
import PlanSections from './PlanSections'
import { buildPlanData, type PlanInput } from './planContent'

interface SuccessPageProps {
  initialUser: User | null
}

const SuccessPage = ({ initialUser }: SuccessPageProps): React.JSX.Element => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [clientUser] = useUser()
  const user = clientUser ?? initialUser
  const [campaign] = useCampaign()

  // Onboarding flips campaign state server-side right before this page mounts;
  // the client cache from earlier in the session is stale.
  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY_KEY })
  }, [queryClient])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const candidateName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()
  const race =
    campaign?.positionName ||
    campaign?.organization?.customPositionName ||
    campaign?.office ||
    ''
  const stateValue = campaign?.details?.state ?? campaign?.state ?? ''
  const city = campaign?.details?.city ?? campaign?.city ?? ''
  const district = campaign?.details?.district ?? ''
  const partisanType = campaign?.details?.partisanType ?? ''
  const electionDateIso =
    campaign?.details?.electionDate ?? campaign?.electionDate ?? null
  const filingDateStartIso = campaign?.details?.filingPeriodsStart ?? null
  const filingDateEndIso = campaign?.details?.filingPeriodsEnd ?? null
  const runningAgainstRef = campaign?.details?.runningAgainst
  const customIssuesRef = campaign?.details?.customIssues
  const stancesRef = campaign?.Stances
  const hubspotIncumbent =
    campaign?.data?.hubSpotUpdates?.incumbent?.trim() || null
  const metrics = campaign?.raceTargetMetrics
  const winNumber = metrics?.winNumber ?? 0
  const projectedTurnout = metrics?.projectedTurnout ?? 0
  const voterContactGoal = metrics?.voterContactGoal ?? winNumber * 5
  const filingFee = metrics?.filingFee ?? null
  const filingRequirementsText = metrics?.filingRequirementsText ?? null

  const plan = useMemo(() => {
    const input: PlanInput = {
      candidateName,
      race,
      district,
      city,
      state: stateValue,
      partisanType,
      electionDateIso,
      filingDateStartIso,
      filingDateEndIso,
      winNumber,
      projectedTurnout,
      voterContactGoal,
      runningAgainst: runningAgainstRef ?? [],
      customIssues: customIssuesRef ?? [],
      stances: (stancesRef ?? []).map((s) => ({
        issueName: s.Issue?.name,
        statement: s.stanceStatement,
      })),
      hubspotIncumbent,
      filingFee,
      filingRequirementsText,
    }
    return buildPlanData(input)
  }, [
    candidateName,
    race,
    district,
    city,
    stateValue,
    partisanType,
    electionDateIso,
    filingDateStartIso,
    filingDateEndIso,
    winNumber,
    projectedTurnout,
    voterContactGoal,
    runningAgainstRef,
    customIssuesRef,
    stancesRef,
    hubspotIncumbent,
    filingFee,
    filingRequirementsText,
  ])

  const handleShare = () => undefined
  const handleContinue = () => router.push('/dashboard')

  return (
    <div className="relative min-h-screen w-full bg-base-surface pb-28 text-foreground">
      <div className="pointer-events-none fixed inset-0 z-40">
        <ConfettiCanvas play />
      </div>

      <main className="mx-auto w-full max-w-4xl px-4 pt-4 pb-12 sm:px-8 sm:pt-16 sm:pb-20">
        <HeroCard
          candidateName={plan.candidateName}
          race={plan.race}
          state={stateValue}
          electionDate={plan.electionDate}
          onShare={handleShare}
        />

        <div className="mt-10 sm:mt-14">
          <PlanSections plan={plan} onShare={handleShare} />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-base-border bg-base-surface">
        <div className="mx-auto flex h-20 w-full max-w-4xl items-center justify-end gap-3 px-4 sm:px-8">
          <Button
            type="button"
            variant="default"
            size="large"
            onClick={handleContinue}
          >
            Campaign manager
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
