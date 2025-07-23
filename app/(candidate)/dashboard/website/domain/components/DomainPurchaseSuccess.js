'use client'
import Button from '@shared/buttons/Button'
import HighFiveAnimation from '@shared/animations/HighFiveAnimation'
import MarketingH3 from '@shared/typography/MarketingH3'
import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner'
import { useEffect } from 'react'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { useWebsite } from '../../components/WebsiteProvider'
import { useSearchParams } from 'next/navigation'

export default function DomainPurchaseSuccess() {
  const { website } = useWebsite()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const domainFromUrl = searchParams.get('domain')
    const priceFromUrl = searchParams.get('price')
    
    const domainSelected = domainFromUrl || website?.domain
    const price = priceFromUrl ? parseFloat(priceFromUrl) : null
    
    if (domainSelected) {
      trackEvent(EVENTS.CandidateWebsite.PurchasedDomain, {
        domainSelected,
        priceOfSelectedDomain: price
      })
    }
  }, [searchParams, website])
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
