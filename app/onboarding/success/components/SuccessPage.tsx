'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { Button, IconButton } from '@styleguide'
import { useCampaign } from '@shared/hooks/useCampaign'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { useUser } from '@shared/hooks/useUser'
import type { User } from 'helpers/types'
import ConfettiCanvas from './ConfettiCanvas'
import HeroCard from './HeroCard'
import PlanSections from './PlanSections'
import SharePlanModal from './SharePlanModal'
import { buildPlanData, type PlanInput } from './planContent'
import { downloadCampaignPlanPdf } from '../pdf/downloadCampaignPlanPdf'

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
