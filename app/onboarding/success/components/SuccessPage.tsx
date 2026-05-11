'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Share2 } from 'lucide-react'
import { Button, GoodPartyOrgLogo, IconButton } from '@styleguide'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import type { User } from 'helpers/types'
import ConfettiCanvas from './ConfettiCanvas'
import PlanSections from 'app/dashboard/strategy/components/PlanSections'
import SharePlanModal from 'app/dashboard/strategy/components/SharePlanModal'
import { buildPlanData } from 'app/dashboard/strategy/components/planContent'

interface SuccessPageProps {
  initialUser: User | null
}

const SuccessPage = ({ initialUser }: SuccessPageProps): React.JSX.Element => {
  const router = useRouter()
  const [clientUser] = useUser()
  const user = clientUser ?? initialUser
  const [campaign] = useCampaign()
  const [shareOpen, setShareOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const enterBase =
    'transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
  const enterFrom = 'opacity-0 translate-y-3'
  const enterTo = 'opacity-100 translate-y-0'
  const enter = `${enterBase} ${mounted ? enterTo : enterFrom}`
  const cardEnterFrom = 'opacity-0 scale-[0.98] translate-y-3'
  const cardEnterTo = 'opacity-100 scale-100 translate-y-0'
  const cardEnter = `${enterBase} ${mounted ? cardEnterTo : cardEnterFrom}`

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
        import('app/dashboard/strategy/components/CampaignPlanPdf'),
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

  const handleContinue = () => router.push('/dashboard')

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="relative min-h-screen w-full bg-base-surface pb-28 text-foreground">
      <div className="pointer-events-none fixed inset-0 z-40">
        <ConfettiCanvas play />
      </div>
      <main className="mx-auto w-full max-w-4xl px-4 pt-8 pb-12 sm:px-8 sm:pt-16 sm:pb-20">
        <div
          className={`relative flex flex-col items-center gap-6 rounded-3xl border border-base-border bg-brand-cream px-6 py-12 text-center sm:px-12 sm:py-16 ${cardEnter}`}
          style={{ transitionDelay: '0ms' }}
        >
          <IconButton
            type="button"
            variant="outline"
            size="medium"
            onClick={() => setShareOpen(true)}
            aria-label="Share campaign plan"
            className="absolute top-3 right-3 sm:top-4 sm:right-4"
          >
            <Share2 className="size-5" />
          </IconButton>

          <div className={enter} style={{ transitionDelay: '300ms' }}>
            <GoodPartyOrgLogo className="!h-12 !w-auto sm:!h-14" />
          </div>

          <h1
            className={`text-4xl font-bold text-foreground sm:text-5xl ${enter}`}
            style={{ transitionDelay: '500ms' }}
          >
            Initial campaign plan
          </h1>

          {plan.candidateName ? (
            <div
              className={`space-y-2 ${enter}`}
              style={{ transitionDelay: '700ms' }}
            >
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase sm:text-sm">
                Prepared for
              </p>
              <p className="text-xl font-bold text-foreground sm:text-2xl">
                {plan.candidateName}
              </p>
            </div>
          ) : null}

          <div
            className={`space-y-1 ${enter}`}
            style={{ transitionDelay: '900ms' }}
          >
            {plan.race ? (
              <p className="text-base text-muted-foreground sm:text-lg">
                {plan.race}
                {plan.location ? ` • ${plan.location}` : ''}
              </p>
            ) : null}
            {plan.electionDate ? (
              <p className="text-sm text-muted-foreground sm:text-base">
                Election Day: {plan.electionDate}
              </p>
            ) : null}
          </div>

          <div
            className={`flex w-full flex-col items-center gap-1 border-t border-base-border pt-6 ${enter}`}
            style={{ transitionDelay: '1100ms' }}
          >
            <p className="text-xs text-muted-foreground sm:text-sm">
              Prepared by GoodParty.org
            </p>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Empowering people to run, win, and serve
            </p>
          </div>
        </div>

        <div
          className={`mt-8 sm:mt-16 ${enter}`}
          style={{ transitionDelay: '1500ms' }}
        >
          <PlanSections plan={plan} />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-base-border bg-base-surface">
        <div className="mx-auto flex h-20 w-full max-w-4xl items-center justify-between gap-3 px-4 sm:px-8">
          <Button
            type="button"
            variant="ghost"
            size="large"
            icon={<Download className="size-5" />}
            onClick={handleDownload}
            loading={downloading}
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
        candidateName={candidateName}
      />
    </div>
  )
}

export default SuccessPage
