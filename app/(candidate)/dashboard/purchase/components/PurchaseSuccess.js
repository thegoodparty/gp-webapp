'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PURCHASE_TYPES, PURCHASE_TYPE_LABELS } from '/helpers/purchaseTypes'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import CheckmarkAnimation from '@shared/animations/CheckmarkAnimation'

export default function PurchaseSuccess({ type, returnUrl }) {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (returnUrl) {
        router.push(returnUrl)
      } else if (type === PURCHASE_TYPES.DOMAIN_REGISTRATION) {
        router.push(`/dashboard/website/domain?success=true`)
      } else {
        router.push('/dashboard')
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [router, returnUrl, type])

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="mb-6">
        <CheckmarkAnimation width={120} height={120} className="mx-auto" />
      </div>
      <H1>Purchase Successful!</H1>
      <Body1 className="mt-4">
        Your {PURCHASE_TYPE_LABELS[type]?.toLowerCase()} has been processed
        successfully. You will be redirected shortly.
      </Body1>
    </div>
  )
}
