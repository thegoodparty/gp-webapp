'use client'
import { Button } from '@styleguide'
import Link from 'next/link'
import HighFiveAnimation from '@shared/animations/HighFiveAnimation'
import MarketingH3 from '@shared/typography/MarketingH3'
import { AlertBanner } from 'app/dashboard/components/AlertBanner'

export default function DomainPurchaseSuccess(): React.JSX.Element {
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
      <AlertBanner
        title="Verify your domain by clicking the link in your email from our hosting provider, Vercel. Allow up to 30 minutes for your site to go live."
        message=""
      />
      <Button asChild className="mt-12">
        <Link href="/dashboard/website">Back to website metrics</Link>
      </Button>
    </div>
  )
}
