'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button, Card, ProBadge } from '@styleguide'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useProUpgrade3Flag } from '@shared/experiments/proUpgrade3Flag'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

// Dashboard entry point into the Pro upgrade wizard. Shown only to the
// pro-upgrade3 cohort (off cohort sees the unchanged dashboard) and hidden once
// the candidate is Pro. "Get Pro" routes into the wizard (value-prop step).
export default function ProUpgradeBanner(): React.JSX.Element | null {
  const router = useRouter()
  const { ready, enabled } = useProUpgrade3Flag()
  const [campaign] = useCampaign()
  const isPro = campaign?.isPro ?? false

  const show = ready && enabled && !isPro

  useEffect(() => {
    if (show) {
      trackEvent(EVENTS.ProUpgrade.Compliance.BannerViewed)
    }
  }, [show])

  if (!show) {
    return null
  }

  const handleGetPro = () => {
    trackEvent(EVENTS.ProUpgrade.Compliance.BannerGetPro)
    router.push('/dashboard/pro-upgrade')
  }

  return (
    <Card className="relative gap-0 overflow-hidden p-6">
      <div className="flex flex-col items-start gap-3 md:pr-44">
        <ProBadge />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold font-opensans text-card-foreground">
            76% of candidates who use Pro win
          </p>
          <p className="text-sm font-opensans text-card-foreground">
            Get a dedicated advisor, quality voter data, and texting tools to
            help you reach every voter that matters.
          </p>
        </div>
        <div className="pt-3">
          <Button onClick={handleGetPro}>Get Pro</Button>
        </div>
      </div>
      <Image
        src="/images/dashboard/pro-upgrade-banner.png"
        alt=""
        width={154}
        height={154}
        className="pointer-events-none absolute right-6 top-6 hidden h-[154px] w-[154px] object-contain md:block"
      />
    </Card>
  )
}
