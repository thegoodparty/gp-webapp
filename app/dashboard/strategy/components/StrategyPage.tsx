'use client'

import { useMemo, useState } from 'react'
import { Download, Share2 } from 'lucide-react'
import { Button } from '@styleguide'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import DashboardLayout from '../../shared/DashboardLayout'
import PlanInputs from './PlanInputs'
import PlanSections from './PlanSections'
import SharePlanModal from './SharePlanModal'
import { buildPlanData } from './planContent'

interface StrategyPageProps {
  pathname: string
}

const StrategyPage = ({ pathname }: StrategyPageProps): React.JSX.Element => {
  const [campaign] = useCampaign()
  const [user] = useUser()
  const [shareOpen, setShareOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const firstName = user?.firstName ?? ''
  const lastName = user?.lastName ?? ''
  const candidateName = [firstName, lastName].filter(Boolean).join(' ').trim()
  const race =
    campaign?.positionName ||
    campaign?.organization?.customPositionName ||
    campaign?.office ||
    'Your race'
  const city = campaign?.details?.city ?? ''
  const state = campaign?.details?.state ?? ''
  const metrics = campaign?.raceTargetMetrics
  const winNumber = metrics?.winNumber ?? 0
  const projectedTurnout = metrics?.projectedTurnout ?? 0
  const voterContactGoal = metrics?.voterContactGoal ?? winNumber * 5

  const plan = useMemo(
    () =>
      buildPlanData({
        candidateName,
        race,
        city,
        state,
        electionDateIso: campaign?.details?.electionDate ?? null,
        winNumber,
        projectedTurnout,
        voterContactGoal,
      }),
    [
      candidateName,
      race,
      city,
      state,
      campaign?.details?.electionDate,
      winNumber,
      projectedTurnout,
      voterContactGoal,
    ],
  )

  const handleDownload = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      const [{ pdf }, { CampaignPlanPdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./CampaignPlanPdf'),
      ])
      const blob = await pdf(<CampaignPlanPdf plan={plan} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName =
        (candidateName || 'campaign-plan')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'campaign-plan'
      a.download = `${safeName}-campaign-plan.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <DashboardLayout
      pathname={pathname}
      campaign={campaign}
      wrapperClassName="!p-0"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Your campaign plan
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              The full plan for winning your race. Update your inputs to see the
              gap.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="large"
              icon={<Download className="size-5" />}
              onClick={handleDownload}
              loading={downloading}
              aria-label="Download campaign plan"
            >
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="large"
              icon={<Share2 className="size-5" />}
              onClick={() => setShareOpen(true)}
              aria-label="Share campaign plan"
            >
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>

        <PlanInputs plan={plan} />

        <PlanSections
          plan={plan}
          onDownload={handleDownload}
          onShare={() => setShareOpen(true)}
          downloading={downloading}
        />
      </div>

      <SharePlanModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={shareUrl}
        candidateName={candidateName}
      />
    </DashboardLayout>
  )
}

export default StrategyPage
