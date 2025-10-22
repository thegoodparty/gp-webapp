'use client'

import Body1 from '@shared/typography/Body1'
import H2 from '@shared/typography/H2'

export default function PurchaseError({ error, serverError }) {
  const errorMessage = serverError || error || 'Failed to initialize purchase'

  return (
    <div className="max-w-2xl mx-auto p-6">
      <H2>Purchase Error</H2>
      <Body1 className="text-red-600 mt-4">{errorMessage}</Body1>
    </div>
  )
}
