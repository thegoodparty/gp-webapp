'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { Button, IconButton } from '@styleguide'
import { useCampaign } from '@shared/hooks/useCampaign'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { useUser } from '@shared/hooks/useUser'
import type { User } from 'helpers/types'
import { localNewsQueryOptions } from '../../components/LocalNewsSourcesSection'
import { voterIssuesQueryOptions } from '../../components/TopVoterIssuesSection'
import ConfettiCanvas from './ConfettiCanvas'
import HeroCard from './HeroCard'
import PlanSections from './PlanSections'
import SharePlanModal from './SharePlanModal'
import {
  buildPlanData,
  type ApiPressOutlet,
  type PlanInput,
} from './planContent'
import { downloadCampaignPlanPdf } from '../pdf/downloadCampaignPlanPdf'
import { useCommunityEvents } from '../hooks/useCommunityEvents'
import { useStrategicLandscape } from '../hooks/useStrategicLandscape'

interface SuccessPageProps {
  initialUser: User | null
}

const SuccessPage = ({ initialUser }: SuccessPageProps): React.JSX.Element => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [clientUser] = useUser()
  const user = clientUser ?? initialUser
  const [campaign] = useCampaign()
  const [shareOpen, setShareOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

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
  const metrics = campaign?.raceTargetMetrics
  // Prefer election-api's officialOfficeName when present — it matches the
  // BR canonical office name and is what voters will see on the ballot.
  const race =
    metrics?.officialOfficeName ||
    campaign?.positionName ||
    campaign?.organization?.customPositionName ||
    campaign?.office ||
    ''
  const stateValue = campaign?.details?.state ?? campaign?.state ?? ''
  const city = campaign?.details?.city ?? campaign?.city ?? ''
  const district = campaign?.details?.district ?? ''
  const partisanType = campaign?.details?.partisanType ?? ''
  // Stage-anchored election date from the race lookup; falls back to the
  // user-entered onboarding date when the race hash didn't resolve.
  const electionDateIso =
    metrics?.relevantElectionDate ??
    metrics?.generalElectionDate ??
    campaign?.details?.electionDate ??
    campaign?.electionDate ??
    null
  const filingDateStartIso = campaign?.details?.filingPeriodsStart ?? null
  const filingDateEndIso = campaign?.details?.filingPeriodsEnd ?? null
  const runningAgainstRef = campaign?.details?.runningAgainst
  const customIssuesRef = campaign?.details?.customIssues
  const stancesRef = campaign?.Stances
  const hubspotIncumbent =
    campaign?.data?.hubSpotUpdates?.incumbent?.trim() || null
  const winNumber = metrics?.winNumber ?? 0
  const projectedTurnout = metrics?.projectedTurnout ?? 0
  const voterContactGoal = metrics?.voterContactGoal ?? winNumber * 5
  const filingFee = metrics?.filingFee ?? null
  const filingRequirementsText = metrics?.filingRequirementsText ?? null
  const registeredVoters = metrics?.registeredVoters ?? null
  const uniqueCellphones = metrics?.uniqueCellphones ?? null
  const uniqueLandlines = metrics?.uniqueLandlines ?? null
  const raceCandidatesRef = metrics?.candidates
  const milestonesRef = metrics?.milestones ?? null
  // 30-90s first generation, instant on cache hit. Hook returns
  // { data | undefined, isGenerating, isPending, isError } — PlanSections
  // decides skeleton vs hidden based on those flags.
  const strategy = useStrategicLandscape()
  // Section 7 community events — same polling shape as strategy. Pre-warm
  // fires after office submit in onboarding, so the cache is usually warm
  // by the time the user lands here.
  const events = useCommunityEvents()
  // Section 7 press outlets — reuse the onboarding local-news endpoint
  // that was already populated during the LocalNewsSourcesSection step.
  // Cache key matches (city, state, office) so we hit the same persisted
  // row from `campaign.data.onboarding.localMediaOutlets`.
  //
  // The endpoint's Zod schema rejects empty-string city/office/state
  // (min 1 char). Pass `undefined` for empty values so the request shape
  // omits the field — onboarding-only-typed `city` is optional, but
  // serializing `city: ''` hits the validator and 400s.
  const localNewsQuery = useQuery(
    localNewsQueryOptions({
      city: city || undefined,
      state: stateValue || undefined,
      office: race || undefined,
    }),
  )
  const pressOutletsFromApi: ApiPressOutlet[] | undefined =
    localNewsQuery.data?.status === 'ready'
      ? localNewsQuery.data.outlets
      : undefined
  // Section 3 voter insights — share the cache key with the on-screen
  // TopVoterIssuesSection from the earlier onboarding step, so this is
  // almost always a synchronous cache hit. When the cache misses (direct
  // nav to /success), buildVoterInsights falls through to candidate
  // customIssues/stances and finally the stub copy.
  // The BR position ID is in-memory on `answers.structuredOffice.positionId`
  // during onboarding. After pledge submit, `OnboardingFlow` persists the
  // whole `answers` object under `campaign.data.onboarding`, so it survives
  // the navigation to /onboarding/success.
  //
  // gp-api separately resolves the BR ID to an internal Position UUID and
  // stores that on `organization.positionId` — which is NOT what the
  // /onboarding/contacts/stats endpoint expects, so we read directly from
  // the persisted onboarding answers instead.
  const onboardingAnswers = (
    campaign?.data as
      | { onboarding?: { structuredOffice?: { positionId?: string } } }
      | undefined
  )?.onboarding
  const ballotReadyPositionId =
    onboardingAnswers?.structuredOffice?.positionId ?? undefined

  // Same cache key as TopVoterIssuesSection in onboarding — keeps the PDF's
  // Section 3 in sync with what the user already saw on screen.
  const voterIssuesQuery = useQuery(
    voterIssuesQueryOptions({
      ballotReadyPositionId,
      city,
      state: stateValue,
      office: race,
    }),
  )
  const voterIssuesFromApi = voterIssuesQuery.data?.issues

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
      registeredVoters,
      uniqueCellphones,
      uniqueLandlines,
      raceCandidates: raceCandidatesRef ?? [],
      milestones: milestonesRef,
      strategicLandscape: strategy.data,
      communityEvents: events.data,
      pressOutletsFromApi,
      voterIssuesFromApi,
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
    registeredVoters,
    uniqueCellphones,
    uniqueLandlines,
    raceCandidatesRef,
    milestonesRef,
    strategy.data,
    events.data,
    pressOutletsFromApi,
    voterIssuesFromApi,
  ])

  const handleShare = () => setShareOpen(true)
  const handleContinue = () => router.push('/dashboard')

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleDownload = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      await downloadCampaignPlanPdf(plan, { liveUrl: shareUrl || undefined })
    } finally {
      setDownloading(false)
    }
  }

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

        <div className="mt-8 sm:mt-14">
          <PlanSections
            plan={plan}
            strategyState={{
              isGenerating: strategy.isPending || strategy.isGenerating,
              isError: strategy.isError,
            }}
            eventsState={{
              isGenerating: events.isPending || events.isGenerating,
              isError: events.isError,
            }}
            voterInsightsContext={{
              ballotReadyPositionId,
              city,
              state: stateValue,
              office: race,
            }}
          />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-base-border bg-base-surface">
        <div className="mx-auto flex h-20 w-full max-w-4xl items-center justify-between gap-3 px-4 sm:px-8">
          <IconButton
            type="button"
            variant="outline"
            size="large"
            onClick={handleDownload}
            loading={downloading}
            aria-label="Download campaign plan"
            className="sm:hidden"
          >
            <Download className="size-5" />
          </IconButton>
          <Button
            type="button"
            variant="outline"
            size="large"
            icon={<Download className="size-5" />}
            onClick={handleDownload}
            loading={downloading}
            className="hidden sm:inline-flex"
          >
            Download
          </Button>
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

      <SharePlanModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={shareUrl}
        candidateName={plan.candidateName}
      />
    </div>
  )
}

export default SuccessPage
