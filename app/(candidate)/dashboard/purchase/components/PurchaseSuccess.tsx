'use client'

import { useRouter } from 'next/navigation'
import { PURCHASE_TYPE_LABELS } from 'helpers/purchaseTypes'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import { useEffect } from 'react'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'

interface PurchaseSuccessProps {
  type: string
  returnUrl?: string
}

export default function PurchaseSuccess({ type, returnUrl }: PurchaseSuccessProps): React.JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (returnUrl) {
        router.push(returnUrl)
      } else if (type === PURCHASE_TYPES.DOMAIN_REGISTRATION) {
        router.push(`/dashboard/website/domain`)
      } else {
        router.push('/dashboard')
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [router, returnUrl, type])

  return (
    <div className="max-w-2xl mx-auto mt-8 text-center">
      <H1>Purchase Successful!</H1>
      <Body1 className="mt-4">
        Your {(PURCHASE_TYPE_LABELS as Record<string, string>)[type]?.toLowerCase()} has been processed
        successfully. You will be redirected shortly.
      </Body1>
    </div>
  )
}



