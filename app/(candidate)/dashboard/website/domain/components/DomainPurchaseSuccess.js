'use client'
import Button from '@shared/buttons/Button'
import HighFiveAnimation from '@shared/animations/HighFiveAnimation'
import MarketingH3 from '@shared/typography/MarketingH3'
import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner'

export default function DomainPurchaseSuccess() {
  return (
    <div className="text-center flex flex-col items-center gap-4">
      <div className="relative h-24 w-24">
        <HighFiveAnimation />
      </div>
      <MarketingH3 className="mb-12">
        Congratulations,
        <br />
        your website is live!
      </MarketingH3>
      <AlertBanner title="Please allow up to 30 minutes for your website to update to the new domain." />
      <Button className="mt-12" href="/dashboard/website">
        Back to website metrics
      </Button>
    </div>
  )
}
